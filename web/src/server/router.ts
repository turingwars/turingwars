import { BadRequestHttpException, NotFoundHttpException } from '@senhung/http-exceptions';
import * as byline from 'byline';
import { spawn } from 'child_process';
import { transformAndValidate } from 'class-transformer-validator';
import { validate } from 'class-validator';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Repository } from 'typeorm';
import * as uuid from 'uuid/v4';
import { twAPI } from '../api';
import { Assembler } from '../assembler/Assembler';
import { BIN_LOCATION, CORESIZE, NUM_CYCLES, UPDATE_PERIOD } from '../config';
import { GetGameResponse } from '../dto/GetGameResponse';
import { GameUpdate } from '../model/GameUpdate';
import { RouterDefinition } from '../typed-apis/express-typed-api';
import { Champion } from './entities/Champion';
import { GameLog } from './entities/GameLog';

const engineCmdLine = [
    path.join(process.cwd(), BIN_LOCATION)
];

export function AppRouter(
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

        saveHero: async (req) => {
            const champ = await championsRepo.findOneOrFail(req.params.id);
            if (champ === undefined) {
                throw new NotFoundHttpException();
            }
            console.log(req.body);
            champ.code = req.body.program;
            champ.name = req.body.name;
            await validate(champ);
            const asm = new Assembler();
            asm.assemble(champ.code); // Check the assembly code before saving
            await championsRepo.save(champ);
            return {
                id: champ.id,
                name: champ.name,
                program: champ.code
            };
        },

        getAllHeros: async () => {
            return (await championsRepo.find()).map((champ) => {
                return {
                    id: champ.id,
                    name: champ.name,
                    program: champ.code
                };
            });
        },

        createGame: async (req) => {
            const request = req.body;
            if (request.champions.length !== 2) {
                throw new BadRequestHttpException('You must send exactly two champion IDs');
            }

            let championNr = 0;
            const champions = await Promise.all(
                request.champions.map(async (id) => await championsRepo.findOneOrFail(id)));
            const programs = await Promise.all(
                champions.map(async (champion) => loadChampion(champion, championNr++)));

            const log: Array<Promise<GameUpdate>> = [];
            const theGame = gamesRepo.create();

            console.log([...engineCmdLine, ...programs]);
            const vm = spawn('node', [
                ...engineCmdLine,
                ...programs,
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

            return {
                url: `/replay/${theGame.id}`
            };
        },

        getGame: async (req) => {
            const gameLog = await gamesRepo.findOneOrFail(req.params.id);
            const response = new GetGameResponse();
            response.id = gameLog.id as string;
            response.isOver = gameLog.isOver;
            response.log = JSON.parse(gameLog.log as string);
            await validate(response);
            return response;
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
}
