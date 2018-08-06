import { NotFoundHttpException } from '@senhung/http-exceptions';
import { json, urlencoded } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { errorReporter } from 'express-youch';
import * as path from 'path';
import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import edit from 'views/edit.top';
import index from 'views/index.top';
import replay from 'views/replay.top';
import * as webpack from 'webpack';
import { twAPI } from '../api';
import { createRouter } from '../typed-apis/express-typed-api';
import { BANNER } from './banner';
import { Champion } from './entities/Champion';
import { GameLog } from './entities/GameLog';
import { AppRouter } from './router';
import { seedDatabase } from './seed';


class TuringWarsApplication {

    private connection: Connection;
    private webpackDevMiddleware: any;

    public async init() {
        console.log(BANNER);

        const wdm = require('webpack-dev-middleware');
        const compiler = webpack(require('../../webpack.config.js'));
        this.webpackDevMiddleware = wdm(compiler, {
            publicPath: '/dist'
        });

        console.log('initializing DB...');
        this.connection = await createConnection({
            type: 'sqlite',
            database: path.join(process.cwd(), '.tmp/sqlite'),
            entities: [
                Champion,
                GameLog
            ],
            logging: false,
            synchronize: true,
        });

        await seedDatabase(this.connection);

        console.log('Initializing server...');

        const app = express();
        app.use(cors());
        app.use(json());
        app.use(urlencoded({ extended: true }));

        const championsRepo = this.connection.getRepository(Champion);
        const gamesRepo = this.connection.getRepository(GameLog);

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


        app.use(this.webpackDevMiddleware);
        app.use(express.static(path.join(process.cwd(), 'public/')));
        app.use((_req, res, next) => {
            if (!res.headersSent) {
                next(new NotFoundHttpException());
            } else {
                next();
            }
        });
        app.use(errorReporter());

        return app;
    }

    public async teardown() {
        await this.connection.close();
        await new Promise((resolve) => this.webpackDevMiddleware.close(resolve));
    }
}

export default new TuringWarsApplication();

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
