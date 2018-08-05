import 'reflect-metadata';

import { NotFoundHttpException } from '@senhung/http-exceptions';
import { json, urlencoded } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { errorReporter } from 'express-youch';
import * as path from 'path';
import { createConnection } from 'typeorm';
import * as webpack from 'webpack';
import { twAPI } from '../api';
import { SERVER_PORT } from '../config';
import { createRouter } from '../typed-apis/express-typed-api';
import edit from './views/edit.top';
import index from './views/index.top';
import replay from './views/replay.top';
import { BANNER } from './banner';
import { Champion } from './entities/Champion';
import { GameLog } from './entities/GameLog';
import { AppRouter } from './router';
import { seedDatabase } from './seed';


const webpackDevServer = require('webpack-dev-middleware');
const compiler = webpack(require(path.join(__dirname, '../../webpack.config.js')));

boot().catch((e) => {
    if (e.stack) {
        console.log(e.stack);
    } else {
        throw e;
    }
});

async function boot() {
    console.log(BANNER);

    console.log('initializing DB...');
    const connection = await createConnection({
        type: 'sqlite',
        database: path.join(process.cwd(), '.tmp/sqlite'),
        entities: [
            path.join(__dirname, 'entities/**/*')
        ],
        logging: false,
        synchronize: true,
    });

    await seedDatabase(connection);

    console.log('Initializing server...');

    const app = express();
    app.use(cors());
    app.use(json());
    app.use(urlencoded());

    const championsRepo = connection.getRepository(Champion);
    const gamesRepo = connection.getRepository(GameLog);

    // HTML pages

    app.get('/', asyncRoute(async () => {
        return index({
            champions: await championsRepo.find()
        });
    }));

    app.get('/champion/:id', asyncRoute(async () => {
        return edit();
    }));

    app.get('/replay/:id', asyncRoute(async (req) => {
        const gameId = req.params.id;
        const game = await gamesRepo.findOneOrFail(gameId);
        return replay({
            GAME_ID: gameId,
            PLAYER_0_NAME: game.player1Name,
            PLAYER_1_NAME: game.player2Name
        });
    }));

    const appRouter = AppRouter(championsRepo, gamesRepo);
    app.use('/api', createRouter(twAPI, appRouter));


    app.use(webpackDevServer(compiler, {
        publicPath: '/dist'
    }));
    app.use(express.static(path.join(process.cwd(), 'public/')));
    app.use((_req, res, next) => {
        if (!res.headersSent) {
            next(new NotFoundHttpException());
        } else {
            next();
        }
    });
    app.use(errorReporter());

    app.listen(SERVER_PORT, () => {
        console.log(`Server is listening on port ${SERVER_PORT}`);
    });
}

function asyncRoute(handler: (req: express.Request, res: express.Response) => Promise<any>) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => handler(req, res)
            .then((v) => {
                if (v !== undefined && !res.headersSent) {
                    res.send(v);
                } else {
                    res.end();
                }
            })
            .catch((e) => {
                next(e);
            });
}
