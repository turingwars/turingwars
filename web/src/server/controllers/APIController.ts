import * as byline from 'byline';
import { spawn } from 'child_process';
import { transformAndValidate } from 'class-transformer-validator';
import { validate } from 'class-validator';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { BadRequestError, Body, Get, HttpError, JsonController, Param, Post } from 'routing-controllers';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import * as uuid from 'uuid/v4';

import { Assembler } from '../../assembler/Assembler';
import { CompilerError } from '../../assembler/CompileError';
import { CORESIZE, NUM_CYCLES, UPDATE_PERIOD } from '../../config';
import { BIN_LOCATION } from '../../config';
import { IAPIParseError } from '../../dto/APIParseError';
import { CreateMatchRequest } from '../../dto/CreateMatchRequest';
import { CreateMatchResponse } from '../../dto/CreateMatchResponse';
import { CreateOrUpdateChampionRequest } from '../../dto/CreateOrUpdateChampionRequest';
import { GetGameResponse } from '../../dto/GetGameResponse';
import { GameUpdate } from '../../model/GameUpdate';
import { Champion } from '../entities/Champion';
import { GameLog } from '../entities/GameLog';
import { orFail } from '../helpers';

const engineCmdLine = [
    path.join(process.cwd(), BIN_LOCATION)
];

class ChampionAssemblyError extends HttpError implements IAPIParseError {

    constructor(public compilerError: CompilerError) {
        super(400);
    }
}

@JsonController('/api')
export class APIController {

    @OrmRepository(Champion)
    private championsRepo: Repository<Champion>;

    @OrmRepository(GameLog)
    private gamesRepo: Repository<GameLog>;

    @Get()
    public index() {
        return this.championsRepo.find();
    }

    @Get('/game/:id')
    public async getGame(@Param('id') id: string): Promise<GetGameResponse> {
        const gameLog = orFail(await this.gamesRepo.findOneById(id));
        const response = new GetGameResponse();
        response.id = gameLog.id as string;
        response.isOver = gameLog.isOver;
        response.log = JSON.parse(gameLog.log as string);
        await validate(response);
        return response;
    }

    @Post('/create-champion')
    public async submitChampion(@Body() request: CreateOrUpdateChampionRequest): Promise<Champion> {
        const ent = Champion.fromRequest(request);
        validate(ent);
        const asm = new Assembler();
        try {
            asm.assemble(ent.code); // Check the assembly code before saving
        } catch (e) {
            throw new ChampionAssemblyError(e);
        }
        await this.championsRepo.save(ent);
        return ent;
    }

    @Post('/create-game')
    public async createGame(@Body() request: CreateMatchRequest): Promise<CreateMatchResponse> {
        if (request.champions.length !== 2) {
            throw new BadRequestError('You must send exactly two champion IDs');
        }

        let championNr = 0;
        const champions = await Promise.all(
            request.champions.map(async (id) => orFail(await this.championsRepo.findOneById(id))));
        const programs = await Promise.all(
            champions.map(async (champion) => this.loadChampion(await champion, championNr++)));

        const log: Array<Promise<GameUpdate>> = [];

        console.log([...engineCmdLine, ...programs]);
        const vm = spawn('node', [...engineCmdLine, ...programs, '' + UPDATE_PERIOD, '' + NUM_CYCLES, '' + CORESIZE]);
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
                await this.gamesRepo.save(theGame);
                console.log(`Game ${theGame.id} is ready!`);
            } else {
                console.log(`Failed to bake game ${theGame.id}; status: ${code}`);
            }
        });

        const theGame = this.gamesRepo.create();
        theGame.player1Name = champions[0].name;
        theGame.player2Name = champions[1].name;
        await this.gamesRepo.save(theGame);

        return {
            url: `/replay/${theGame.id}`
        };
    }

    /**
     * Assemble and load champion code to disk.
     */
    private async loadChampion(player: Champion, championNr: number): Promise<string> {

        const asm = new Assembler({
            id: championNr,
            coresize: CORESIZE
        });
        const program = asm.assemble(player.code);

        const dest = path.join(os.tmpdir(), uuid());

        await new Promise((resolve, reject) => fs.writeFile(dest, JSON.stringify(program), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        }));

        return dest;
    }
}
