import 'reflect-metadata';

import { NotFoundHttpException } from '@senhung/http-exceptions';
import { json, urlencoded } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { errorReporter } from 'express-youch';
import * as path from 'path';
import { BANNER } from './banner';
import { Container } from 'inversify';
import { EXPRESS_APP, IModule } from './framework';
import { TuringWarsModule } from './modules/TuringWars/TuringWarsModule';

const APP_MODULES: IModule[] = [
    new TuringWarsModule()
];

class TuringWarsApplication {

    private webpackDevMiddleware?: any;
    private container: Container = new Container();

    /**
     * Called when the application starts.
     * 
     * In dev, each time you make a change to the server, the application automatically goes
     * through a cycle of `teardown` and `init` again.
     * 
     * See `boot.ts` for more info.
     */
    public async init() {
        console.log(BANNER);

        console.log('initializing front-end build pipeline...');
        await this.initializeFrontEnd();

        console.log('Initializing server...');
        const app = await this.initServer();

        console.log('Server ready');
        return app;
    }

    /**
     * Called when the application is terminated. It is important to close here any resource you opened
     * because the application may be restarted multiple times in the same process during development.
     * You are, however, guaranteed that the next application will not be `init`ialized until the last
     * one has fully completed its `teardown`. 
     */
    public async teardown() {
        await APP_MODULES.reduce((p, m) => p.then(() => m.teardown()), Promise.resolve());
        this.container.unbindAll();
        await new Promise<void>((resolve) => {
            if (this.webpackDevMiddleware) {
                this.webpackDevMiddleware.close(resolve);
                this.webpackDevMiddleware = undefined;
            } else {
                resolve();
            }
        });
    }

    /**
     * Express server boilerplate initialization.
     */
    private async initServer() {
        // A quick note on express. You can read the following code as "the express stack of middlewares".
        // Incoming requests go through the stack from the top to the bottom, and responses travel back from
        // wherever the request was actually handled, back to the top and out to the client.
        const app = express();

        this.container.bind(EXPRESS_APP).toConstantValue(app);

        // Pre-application logic stuff
        app.use(cors());
        app.use(json());
        app.use(urlencoded({ extended: true }));

        // Application logic.
        console.log("Configuring modules...");
        await APP_MODULES.reduce((p, m) => p.then(() => m.configure(this.container)), Promise.resolve());
        console.log("Starting modules...");
        await APP_MODULES.reduce((p, m) => p.then(() => m.start(this.container)), Promise.resolve());

        // Static files and front-end assets
        if (this.webpackDevMiddleware) {
            app.use(this.webpackDevMiddleware);
        }
        app.use(express.static(path.join(__dirname, '../../public/')));

        // Error handling
        app.use(this.defaultHandler);
        app.use(errorReporter());

        return app;
    }


    /**
     * Creates a development middleware for the front-end.
     * 
     * This will intercept all HTTP requests for the front-end assets (such as 'app.js')
     * and serve them straight from webpack, without ever hitting the disk.
     * 
     * Webpack watches the source files and compiles them as you save them.
     * This means that every time you refresh the page, you will get a freshly
     * compiled frontend package.
     * 
     * Also, we could use this to do hot module replacement on the front-end (just like we
     * currently do for the backend). With HMR, you wouldn't even have to refresh the page
     * to see your changes. They would instantaneously pop up in your browser.
     */
    private async initializeFrontEnd() {
        if (process.env.NODE_ENV != 'production') {
            const webpack = require<typeof import('webpack')>('webpack'); 
            const wdm = require('webpack-dev-middleware');
            const compiler = webpack(require('../../webpack-client.config.js'));
            this.webpackDevMiddleware = wdm(compiler, {
                publicPath: '/dist'
            });
        }
    }

    /**
     * Last request handler in the stack. Catches unhandled requests and throws a proper 404 from there.
     * I don't like express' default 404 handler.
     */
    private async defaultHandler(_req: express.Request, res: express.Response, next: express.NextFunction) {
        // Catch unhandled requests and throws a proper 404 from there.
        if (!res.headersSent) {
            next(new NotFoundHttpException());
        } else {
            next();
        }
    }
}

export default new TuringWarsApplication();
