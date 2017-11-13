import { Controller, Get, Param } from 'routing-controllers';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Champion } from '../entities/Champion';
import { GameLog } from '../entities/GameLog';
import { orFail } from '../helpers';
import edit from '../views/edit.top';
import index from '../views/index.top';
import replay from '../views/replay.top';

@Controller()
export class MainController {

    @OrmRepository(Champion)
    private championsRepo: Repository<Champion>;

    @OrmRepository(GameLog)
    private gamesRepo: Repository<GameLog>;

    @Get('/')
    public async home() {
        return index({
            champions: await this.championsRepo.find()
        });
    }

    @Get('/champion/:id')
    public async championPage(@Param('id') id: string) {
        return edit({
            champion: orFail(await this.championsRepo.findOneById(id))
        });
    }

    @Get('/replay/:id')
    public async replayGame(@Param('id') gameId: string) {
        const game = orFail(await this.gamesRepo.findOneById(gameId));
        return replay({
            GAME_ID: gameId,
            PLAYER_0_NAME: game.player1Name,
            PLAYER_1_NAME: game.player2Name
        });
    }
}
