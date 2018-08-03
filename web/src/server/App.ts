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
import { twAPI } from '../api';
import { SERVER_PORT } from '../config';
import { createRouter } from '../typed-apis/TypedApi';
import { BANNER } from './banner';
import { Champion } from './entities/Champion';
import { seedDatabase } from './seed';


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

        // const apiRouter = express.Router();
        // app.use('/api', apiRouter);
        // const router = RestypedRouter<IAPIDefinition>(apiRouter);
        // router.get('/hero/:id', async (req) => {
        //     const champ = await championsRepo.findOneOrFail(req.params.id);
        //     if (champ == null) {
        //         throw new NotFoundHttpException();
        //     }
        //     return {
        //         id: champ.id,
        //         name: champ.name,
        //         program: champ.code
        //     };
        // });

        // router.put('/hero/:id', async (req) => {
        //     const ent = await championsRepo.findOneOrFail(req.params.id);
        //     if (ent === undefined) {
        //         throw new NotFoundHttpException();
        //     }
        //     ent.code = req.body.program;
        //     ent.name = req.body.name;
        //     validate(ent);
        //     const asm = new Assembler();
        //     asm.assemble(ent.code); // Check the assembly code before saving
        //     await championsRepo.save(ent);
        //     return ent;
        // });

        app.use(createRouter(twAPI, (builder) => builder
            // You must implement all route handlers defined in the API definition
            .getHero(async (req) => {
                const champ = await championsRepo.findOneOrFail(req.params.id);
                return {
                    id: champ.id,
                    name: champ.name,
                    program: champ.code
                };
            })
            .saveHero(async (req) => {
                return {
                    program: '',
                    id: '',
                    name: ''
                };
            })
            .getAllHeros(async (req) => {
                return [];
            })
        ));

        app.use(webpackDevServer(compiler, {
            publicPath: '/dist'
        }));

        app.use(express.static(path.join(process.cwd(), 'public/')));

        app.use((_req, _res, next) => next(new NotFoundHttpException()));

        app.use(errorReporter());

        app.listen(SERVER_PORT, () => {
            console.log(`Server is listening on port ${SERVER_PORT}`);
        });
    }
}
