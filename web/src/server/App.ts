import { json, urlencoded } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import { useExpressServer } from 'routing-controllers';
import { Service } from 'typedi';
import { createConnection } from 'typeorm';

import { SERVER_PORT } from '../config';
import { BANNER } from './banner';
import { seedDatabase } from './seed';

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

        seedDatabase(connection);

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

        app.use(express.static(path.join(process.cwd(), 'public/')));

        app.listen(SERVER_PORT, () => {
            console.log(`Server is listening on port ${SERVER_PORT}`);
        });
    }
}
