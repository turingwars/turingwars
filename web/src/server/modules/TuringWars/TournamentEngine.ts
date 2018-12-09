import { injectable, inject } from "inversify";
import { Assembler } from 'shared/assembler/Assembler';
import { CORESIZE, NUM_CYCLES, UPDATE_PERIOD } from 'shared/constants';
import { getManager, Repository } from 'typeorm';
import { Engine, EngineConfiguration } from '../../../../lib/engine';
import { Champion } from './data/Champion';
import { GameLog } from './data/GameLog';
import { GAMES_REPO, CHAMPIONS_REPO } from './TuringWarsModuleConstants';
import { SimulationResult } from './engine-interface'

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
            @inject(CHAMPIONS_REPO) private championsRepo: Repository<Champion>
    ) { }

    /**
     * Starts continuously simulating games to keep the scores up to date.
     */
    public startAutoUpdate(): void{
        console.log("Starting auto update: " + this.pendingAutoUpdate);
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
            // SELECT count(), p1 FROM games group 
            const leastPlayed = await this.championsRepo.createQueryBuilder()
                .leftJoin('game_log', 'GameLog', 'GameLog.player1Id = Champion.id')
                .select(['Champion.id', 'count(*) as total'])
                .groupBy('Champion.id')
                .orderBy('total')
                .getOne();

            if (leastPlayed != null) {
                console.log(leastPlayed);
                
                const missingMatch = await this.championsRepo.createQueryBuilder()
                    .andWhere(`NOT EXISTS(SELECT 1 FROM game_log WHERE game_log.player1Id = ${leastPlayed.id} AND game_log.player2Id = Champion_id)`)
                    .getOne();
                console.log(missingMatch);

                if (missingMatch != null) {
                    await this.createGame([
                        await this.championsRepo.findOneOrFail(leastPlayed.id),
                        missingMatch
                    ]);
                }
            }
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

    /**
     * Starts a game simulation.
     * 
     * If the match has already been played, returns the saved copy of that game.
     */
    public async createGame(champions: Champion[]): Promise<GameLog> {
        const theGame = this.gamesRepo.create();

        // TODO: If an id is null, then this game is a playtest. Should use a different function for playtests

        theGame.player1Id = champions[0].id;
        theGame.player2Id = champions[1].id;
        theGame.player1Name = champions[0].name;
        theGame.player2Name = champions[1].name;
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

        const config: EngineConfiguration = {
            diffFrequency: UPDATE_PERIOD,
            memorySize: CORESIZE,
            nbCycles: NUM_CYCLES
        };

        const engine = new Engine(
            this.loadChampion(champions[0], 0),
            this.loadChampion(champions[1], 1),
            JSON.stringify(config)
        );

        const result = SimulationResult.check(JSON.parse(engine.run()));

        theGame.log = JSON.stringify(result.frames);
        theGame.isOver = true;
        theGame.winner = result.outcome.winner;
        theGame.player1EndScore = result.outcome.score1;
        theGame.player2EndScore = result.outcome.score2;

        await this.gamesRepo.save(theGame);

        await getManager().transaction(async transactionalEntityManager => {
            const u1 = await transactionalEntityManager.findOneOrFail(Champion, champions[0].id);
            const u2 = await transactionalEntityManager.findOneOrFail(Champion, champions[1].id);
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

    /**
     * Assemble and load champion code to disk.
     */
    private loadChampion(player: Champion, championNr: number): string {
        const asm = new Assembler({
            id: championNr,
            coresize: CORESIZE
        });
        const program = asm.assemble(player.code);
        return JSON.stringify(program);
    }
}


