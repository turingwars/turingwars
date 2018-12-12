import { injectable, inject } from "inversify";
import { getManager, Repository } from 'typeorm';
import { Champion } from './data/Champion';
import { GameLog } from './data/GameLog';
import { GAMES_REPO, CHAMPIONS_REPO } from './TuringWarsModuleConstants';
import { GameEngine } from './GameEngine';

/**
 * Handles matchmaking and ranking.
 * 
 * `createGame` simulates games between champions and updates their scores.
 * 
 * New games are continuously being simulated to keep the scores up to date.
 */
@injectable()
export class TournamentEngine {

    private static AUTO_UPDATE_DELAY_MS = 3000;

    private isAutoUpdateEnabled = false;
    private pendingAutoUpdate = false;
    private onAutoUpdateEnd: (() => void) | null = null;

    constructor(
            @inject(GAMES_REPO) private gamesRepo: Repository<GameLog>,
            @inject(CHAMPIONS_REPO) private championsRepo: Repository<Champion>,
            @inject(GameEngine) private gameEngine: GameEngine
    ) { }

    /**
     * Starts continuously simulating games to keep the scores up to date.
     */
    public startAutoUpdate(): void{
        console.log(`Starting auto update: ${this.pendingAutoUpdate}`);
        this.isAutoUpdateEnabled = true;
        if (!this.pendingAutoUpdate) {
            this.pendingAutoUpdate = true;
            setTimeout(() => this.autoUpdate(), 0);
        }
    }

    /**
     * Stops continuously simulating games.
     */
    public async stopAutoUpdate(): Promise<void> {
        /* tslint:disable-next-line:promise-must-complete */
        return new Promise<void>((resolve) => {
            this.isAutoUpdateEnabled = false;
            if (!this.pendingAutoUpdate) {
                // Update is running, we want to wait until it is no longer running.
                // Otherwise, the caller might close the database connection while the auto updater is working on it.
                this.onAutoUpdateEnd = resolve;
            } else {
                resolve();
            }
        });
    }

    private async autoUpdate() {
        this.pendingAutoUpdate = false;
        try {
            await this.findMissingGameAndSimulate();
        } catch (e) {
            console.error(e);
        } finally {
            if (this.onAutoUpdateEnd) {
                this.onAutoUpdateEnd();
                this.onAutoUpdateEnd = null;
            }
            if (this.isAutoUpdateEnabled) {
                this.pendingAutoUpdate = true;
                setTimeout(() => this.autoUpdate(), TournamentEngine.AUTO_UPDATE_DELAY_MS);
            }
        }
    }

    private async findMissingGameAndSimulate() {
        // Find the champion which has played the least number of games in position 1 (aka "player1")
        const leastPlayed = await this.championsRepo.createQueryBuilder()
            .leftJoin('game_log', 'GameLog', 'GameLog.player1Id = Champion.id')
            .select(['Champion.id', 'count(*) as total'])
            .groupBy('Champion.id')
            .orderBy('total')
            .getOne();
        if (leastPlayed != null) {
            // Now find a match it has not played yet
            const missingMatch = await this.championsRepo.createQueryBuilder()
                .andWhere(`NOT EXISTS(SELECT 1 FROM game_log WHERE game_log.player1Id = ${leastPlayed.id} AND game_log.player2Id = Champion_id)`)
                .getOne();
            if (missingMatch != null) {
                // Simulate that game
                await this.createGame(
                    await this.championsRepo.findOneOrFail(leastPlayed.id),
                    missingMatch
                );
            }
        }
    }

    /**
     * Starts a game simulation.
     * 
     * If the match has already been played, returns the saved copy of that game.
     */
    public async createGame(player1: Champion, player2: Champion): Promise<GameLog> {
        const theGame = this.gamesRepo.create();

        theGame.player1Id = player1.id;
        theGame.player2Id = player2.id;
        theGame.player1Name = player1.name;
        theGame.player2Name = player2.name;
        try {
            await this.gamesRepo.save(theGame);
        } catch (e) {
            if (/UNIQUE constraint failed/.test(e.message)) {
                return this.gamesRepo.findOneOrFail({
                    where: {
                        player1Id: theGame.player1Id,
                        player2Id: theGame.player2Id
                    }
                });
            }
        }

        const result = this.gameEngine.simulate(player1.code, player2.code);

        theGame.log = JSON.stringify(result.frames);
        theGame.isOver = true;
        theGame.winner = result.outcome.winner;
        theGame.player1EndScore = result.outcome.score1;
        theGame.player2EndScore = result.outcome.score2;

        await this.gamesRepo.save(theGame);

        // This is likely not re-entrant and may cause a race. See https://github.com/turingwars/turingwars/issues/58
        await getManager().transaction(async transactionalEntityManager => {
            const u1 = await transactionalEntityManager.findOneOrFail(Champion, player1.id);
            const u2 = await transactionalEntityManager.findOneOrFail(Champion, player2.id);
            if (theGame.winner === 0) {
                u1.score += 3;
                u1.wins++;
                u2.score += 1;
                u2.losses++;
            } else {
                u1.score += 1;
                u1.losses ++;
                u2.score += 3;
                u2.wins ++;
            }
            await transactionalEntityManager.save(u1);
            await transactionalEntityManager.save(u2);
        });

        console.log(`Game ${theGame.id} is ready!`);

        return theGame;
    }
}


