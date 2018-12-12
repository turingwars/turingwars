import { inject, injectable } from 'inversify';
import * as express from 'express';
import { TournamentEngine } from './TournamentEngine';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { GameLog } from './data/GameLog';
import { Champion } from './data/Champion';
import { buildRouter } from 'rest-ts-express';
import { endpoints } from 'shared/api/endpoints';
import { Assembler } from 'shared/assembler/Assembler';
import { BadRequestHttpException } from '@senhung/http-exceptions';
import { API_RESULTS_PER_PAGE } from 'shared/constants';
import { GetGameResponse } from 'shared/api/dto';
import { getConfig } from 'server/config';
import { EXPRESS_APP } from 'server/framework';
import { CHAMPIONS_REPO, GAMES_REPO } from './TuringWarsModuleConstants';
import { GameEngine } from './GameEngine';

@injectable()
export class TuringWarsServer {

    constructor(
        @inject(EXPRESS_APP) private app: express.Application,
        @inject(CHAMPIONS_REPO) private championsRepo: Repository<Champion>,
        @inject(GAMES_REPO) private gamesRepo: Repository<GameLog>,
        @inject(TournamentEngine) private tournament: TournamentEngine,
        @inject(GameEngine) private gameEngine: GameEngine
    ) { }

    public attach() {
        this.app.use('/api', this.getRouter());
    }

    private getRouter() {
        return buildRouter(endpoints, (_) => _
            .getHero(async (req) => {
                const champ = await this.championsRepo.findOneOrFail(req.params.id);
                return {
                    id: champ.id.toString(),
                    name: champ.name,
                    program: champ.code
                };
            })

            .commitHero(async (req) => {
                const champ = this.championsRepo.create();
                champ.code = req.body.program;
                champ.name = req.body.name;
                const asm = new Assembler();
                const program = asm.assemble(champ.code); // Check the assembly code before saving

                const maxProgramSize = getConfig().game.maxProgramSize;
                if(program.program.length > maxProgramSize) {
                    throw new BadRequestHttpException(`Program too long! Maximum program size is: ${maxProgramSize} instructions.`);
                }

                try {
                    await this.championsRepo.save(champ);
                } catch (e) {
                    if ((e.message as string).indexOf("UNIQUE constraint failed") != -1) {
                        throw new BadRequestHttpException("This name is already taken. Chose a different name.");
                    }
                }
                return {
                    program: champ.code,
                    name: champ.name,
                    id: champ.id.toString()
                };
            })

            .listHeros(async (req) => {
                // TODO: Factor the pagination out in a helper if we are likely to use it more than once
                const page = parseInt(req.query.page || '0', 10);

                const findOptions: FindManyOptions<Champion> = {
                    take: API_RESULTS_PER_PAGE,
                    skip: page * API_RESULTS_PER_PAGE
                };

                if (req.query.searchTerm) {
                    findOptions.where = {
                        name: Like(`%${req.query.searchTerm || ''}%`)
                    }
                }

                const [ heros, total ] = await this.championsRepo.findAndCount(findOptions);
                const data = await Promise.all(heros.map(async (champ) => {
                    return {
                        id: champ.id.toString(),
                        name: champ.name,
                        rank: (await this.championsRepo.createQueryBuilder()
                            .where('score > :score', { score: champ.score })
                            .getCount()) + 1,
                        score: champ.score,
                        wins: champ.wins,
                        losses: champ.losses
                    };
                }));
                const nextPage = ((page + 1) * API_RESULTS_PER_PAGE >= total) ? null : page + 1;
                const previousPage = page > 0 ? page - 1 : null;

                return {
                    data,
                    page,
                    nextPage,
                    previousPage,
                    total,
                    perPage: API_RESULTS_PER_PAGE
                };
            })

            .createGame(async (req) => {
                const request = req.body;
                if (request.champions.length !== 2) {
                    throw new BadRequestHttpException('You must send exactly two champion IDs');
                }
                const [ player1, player2 ] = await Promise.all(
                    request.champions.map(async (id) => await this.championsRepo.findOneOrFail(id)));
                const theGame = await this.tournament.createGame(player1, player2);

                return {
                    gameId: `${theGame.id}`
                };
            })

            .playTest(async (req) => {
                const opponent = await this.championsRepo.findOneOrFail(req.body.opponent);
                const tmpHero = new Champion();
                tmpHero.code = req.body.hero.program;
                tmpHero.name = 'tmp';
        
                const result = this.gameEngine.simulate(req.body.hero.program, opponent.code);

                return {
                    log: result.frames,
                    opponentName: opponent.name
                };
            })

            .getGame(async (req) => {
                const gameLog = await this.gamesRepo.findOneOrFail(req.params.id);
                const resp: GetGameResponse = {
                    isOver: gameLog.isOver,
                    player1Name: gameLog.player1Name,
                    player2Name: gameLog.player2Name,
                    id: gameLog.id.toString(),
                    log: JSON.parse(gameLog.log || '[]')
                };
                return resp;
            })
        );
    }
}
