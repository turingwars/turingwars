import { BadRequestHttpException } from '@senhung/http-exceptions';
import { validate } from 'class-validator';
import { twAPI } from 'shared/api';
import { Assembler } from 'shared/assembler/Assembler';
import { API_RESULTS_PER_PAGE, CORESIZE, NUM_CYCLES, UPDATE_PERIOD } from 'shared/constants';
import { GetGameResponse } from 'shared/dto/GetGameResponse';
import { RouterDefinition } from 'shared/typed-apis/express-typed-api';
import { Repository } from 'typeorm';
import { Engine, EngineConfiguration } from '../../lib/engine';
import { Champion } from './entities/Champion';
import { GameLog } from './entities/GameLog';
import { EngineRunResult } from './engine-interface';

export function appRouter(
        championsRepo: Repository<Champion>,
        gamesRepo: Repository<GameLog>
    ): RouterDefinition<typeof twAPI> {


    return {
        getHero: async (req) => {
            const champ = await championsRepo.findOneOrFail(req.params.id);
            return {
                id: champ.id.toString(),
                name: champ.name,
                program: champ.code
            };
        },

        commitHero: async (req) => {
            const champ = championsRepo.create();
            champ.code = req.body.program;
            champ.name = req.body.name;
            await validate(champ);
            const asm = new Assembler();
            asm.assemble(champ.code); // Check the assembly code before saving
            try {
                await championsRepo.save(champ);
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
        },

        listHeros: async (req) => {
            // TODO: Factor the pagination out in a helper if we are likely to use it more than once
            const page = parseInt(req.query.page || '0', 10);
            const [ heros, total ] = await championsRepo.findAndCount({
                take: API_RESULTS_PER_PAGE,
                skip: page * API_RESULTS_PER_PAGE,
            });
            const data = heros.map((champ) => {
                return {
                    id: champ.id.toString(),
                    name: champ.name
                };
            });
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
        },

        createGame: async (req) => {
            const request = req.body;
            if (request.champions.length !== 2) {
                throw new BadRequestHttpException('You must send exactly two champion IDs');
            }
            const champions = await Promise.all(
                request.champions.map(async (id) => await championsRepo.findOneOrFail(id)));
            const theGame = await createGame(champions);

            return {
                gameId: `${theGame.id}`
            };
        },


        playTest: async (req) => {
            const opponent = await championsRepo.findOneOrFail(req.body.opponent);
            const tmpHero = new Champion();
            tmpHero.code = req.body.hero.program;
            tmpHero.name = 'tmp';

            const theGame = await createGame([
                tmpHero,
                opponent
            ]);
            return {
                gameId: `${theGame.id}`
            };
        },

        getGame: async (req) => {
            const gameLog = await gamesRepo.findOneOrFail(req.params.id);
            const resp: GetGameResponse = {
                ...gameLog,
                id: gameLog.id.toString(),
                log: JSON.parse(gameLog.log || '[]')
            };
            return resp;
        }
    };

    /**
     * Assemble and load champion code to disk.
     */
    function loadChampion(player: Champion, championNr: number): string {
        const asm = new Assembler({
            id: championNr,
            coresize: CORESIZE
        });
        const program = asm.assemble(player.code);
        return JSON.stringify(program);
    }

    /**
     * Starts a game simulation. Returns the game before it has been fully simulated.
     * Consumers must poll the game's "isOver" flag to determine when it is done simulating.
     */
    async function createGame(champions: Champion[]) {
        const theGame = gamesRepo.create();

        theGame.player1Name = champions[0].name;
        theGame.player2Name = champions[1].name;
        await gamesRepo.save(theGame);

        const config: EngineConfiguration = {
            diffFrequency: UPDATE_PERIOD,
            memorySize: CORESIZE,
            nbCycles: NUM_CYCLES
        };

        const engine = new Engine(
            loadChampion(champions[0], 0),
            loadChampion(champions[1], 1),
            JSON.stringify(config)
        );

        const result = EngineRunResult.check(JSON.parse(engine.run()));

        // TODO: Validate result using some schema validation thingy

        theGame.log = JSON.stringify(result);
        theGame.isOver = true;
        await gamesRepo.save(theGame);

        console.log(`Game ${theGame.id} is ready!`);

        return theGame;
    }
}
