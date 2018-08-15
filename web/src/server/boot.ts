import * as http from 'http';
import application from './server';

// This is the entry point to the server code. You should never have to change that.
// It bootstraps "server.ts" and listens to webpack for changes.
// Did I say webpack? Yes, we run the server-side code through webpack.
// This helps us hot-reload the server whenever a change is made to the code,
// which means no more restarting the server each time you want to test some change!

async function boot() {
    const SERVER_PORT = process.env.PORT || 3000;
    const handler = await application.init();
    const server = http.createServer(handler);

    let currentHandler = handler;
    let currentApp = application;

    server.listen(SERVER_PORT, () => {
        console.log(`Server is listening on port ${SERVER_PORT}`);
    });

    if (module.hot) {
        module.hot.accept('./server', () => {
            replace().catch((e) => { throw e; });;
        });
    }

    /**
     * This is the actual hot replacement logic.
     */
    async function replace() {
        const newApplication = require('./server').default;
        server.removeListener('request', currentHandler);
        await currentApp.teardown();
        currentApp = newApplication;
        currentHandler = await newApplication.init();
        server.on('request', currentHandler);
    }
}

boot().catch((e) => { throw e; });
