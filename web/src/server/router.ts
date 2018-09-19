import { BadRequestHttpException } from '@senhung/http-exceptions';
import * as byline from 'byline';
import { spawn } from 'child_process';
import { transformAndValidate } from 'class-transformer-validator';
import { validate } from 'class-validator';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Repository, FindManyOptions, Like } from 'typeorm';
import * as uuid from 'uuid/v4';
import { twAPI } from '../api';
import { Assembler } from '../assembler/Assembler';
import { API_RESULTS_PER_PAGE, BIN_LOCATION, CORESIZE, NUM_CYCLES, UPDATE_PERIOD } from '../config';
import { GameUpdate } from '../model/GameUpdate';
import { RouterDefinition } from '../typed-apis/express-typed-api';
import { Champion } from './entities/Champion';
import { GameLog } from './entities/GameLog';

const engineCmdLine = [
    path.join(process.cwd(), BIN_LOCATION)
];

export function appRouter(
        championsRepo: Repository<Champion>,
        gamesRepo: Repository<GameLog>
    ): RouterDefinition<typeof twAPI> {


    return {
        getHero: async (req) => {
            const champ = await championsRepo.findOneOrFail(req.params.id);
            return {
                id: champ.id,
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
                id: champ.id
            };
        },

        listHeros: async (req) => {
            // TODO: Factor the pagination out in a helper if we are likely to use it more than once
            const page = parseInt(req.query.page || '0', 10);
            const searchTerm = req.query.searchTerm
            
            let searchQuery: FindManyOptions = {
                take: API_RESULTS_PER_PAGE,
                skip: page * API_RESULTS_PER_PAGE,
            }

            if (searchTerm != null) {
                searchQuery.where = {name: Like(`%${searchTerm}%`)}
            }

            const [ heros, total ] = await championsRepo.findAndCount(searchQuery);
            const data = heros.map((champ) => {
                return {
                    id: champ.id,
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
            const tmpHero: Champion = {
                code: req.body.hero.program,
                name: 'tmp',
                id: 'null'
            };
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
            const resp = {
                ...gameLog,
                log: JSON.parse(gameLog.log || '[]')
            };
            return resp;
        }
    };

    /**
     * Assemble and load champion code to disk.
     */
    async function loadChampion(player: Champion, championNr: number): Promise<string> {

        const asm = new Assembler({
            id: championNr,
            coresize: CORESIZE
        });
        const program = asm.assemble(player.code);

        const dest = path.join(os.tmpdir(), uuid());

        await new Promise<void>((resolve, reject) => fs.writeFile(dest, JSON.stringify(program), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        }));

        return dest;
    }

    /**
     * Starts a game simulation. Returns the game before it has been fully simulated.
     * Consumers must poll the game's "isOver" flag to determine when it is done simulating.
     */
    async function createGame(champions: Champion[]) {
        const log: Array<Promise<GameUpdate>> = [];
        const theGame = gamesRepo.create();
        let championNr = 0;
        const programFiles = await Promise.all(
            champions.map(async (champion) => loadChampion(champion, championNr++)));

        console.log([...engineCmdLine, ...programFiles]);
        const vm = spawn('node', [
            ...engineCmdLine,
            ...programFiles,
            `${UPDATE_PERIOD}`,
            `${NUM_CYCLES}`,
            `${CORESIZE}`]);
        const lines = byline(vm.stdout, {
            encoding: 'utf-8'
        });
        lines.on('data', (data) => {
            const p = transformAndValidate(GameUpdate, data as string) as Promise<GameUpdate>;
            p.catch((e) => console.error(e));
            log.push(p);
        });

        vm.stderr.on('data', (d) => {
            console.log(d.toString());
        });

        vm.on('exit', async (code) => {
            if (code === 0) {
                const resolved = await Promise.all(log);
                theGame.log = JSON.stringify(resolved);
                theGame.isOver = true;
                await gamesRepo.save(theGame);
                console.log(`Game ${theGame.id} is ready!`);
            } else {
                console.log(`Failed to bake game ${theGame.id}; status: ${code}`);
            }
        });

        theGame.player1Name = champions[0].name;
        theGame.player2Name = champions[1].name;
        await gamesRepo.save(theGame);

        return theGame;
    }
}
