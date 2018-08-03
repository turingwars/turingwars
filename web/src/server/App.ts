import { NotFoundHttpException } from '@senhung/http-exceptions';
import { json, urlencoded } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { errorReporter } from 'express-youch';
import * as path from 'path';
import { useExpressServer } from 'routing-controllers';
import { Service } from 'typedi';
import { createConnection } from 'typeorm';
import * as webpack from 'webpack';
import { Hero, twAPI } from '../api';
import { SERVER_PORT } from '../config';
import { createRouter, RouterDefinition } from '../typed-apis/express-typed-api';
import { BANNER } from './banner';
import { Champion } from './entities/Champion';
import { seedDatabase } from './seed';
import { validate } from 'class-validator';
import { Assembler } from '../assembler/Assembler';


const webpackDevServer = require('webpack-dev-middleware');
const compiler = webpack(require(path.join(__dirname, '../../webpack.config.js')));

@Service()
export class App {

    public async boot() {
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
        useExpressServer(app, {
            controllers: [
                path.join(__dirname, 'controllers/**/*'),
            ],
        });

        const championsRepo = connection.getRepository(Champion);
    
        const hash: RouterDefinition<typeof twAPI> = {
            async getHero(req) {
                const champ = await championsRepo.findOneOrFail(req.params.id);
                return {
                    id: champ.id,
                    name: champ.name,
                    program: champ.code
                };
            },
            async saveHero(req): Promise<Hero> {
                const champ = await championsRepo.findOneOrFail(req.params.id);
                if (champ === undefined) {
                    throw new NotFoundHttpException();
                }
                champ.code = req.body.program;
                champ.name = req.body.name;
                validate(champ);
                const asm = new Assembler();
                asm.assemble(champ.code); // Check the assembly code before saving
                await championsRepo.save(champ);
                return {
                    id: champ.id,
                    name: champ.name,
                    program: champ.code
                };
            },
            async getAllHeros(): Promise<Hero[]> {
                return (await championsRepo.find()).map((champ) => {
                    return {
                        id: champ.id,
                        name: champ.name,
                        program: champ.code
                    }
                });
            }
        };
        app.use('/api', createRouter(twAPI, hash));

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
}
