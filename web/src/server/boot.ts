import * as http from 'http';
import application from './server';

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
            replace();
        });
    }
    async function replace() {
        const newApplication = require('./server').default;
        console.log('Receiving update');
        server.removeListener('request', currentHandler);
        console.log('reoved');
        await currentApp.teardown();
        console.log('torn down');

        currentApp = newApplication;
        console.log('will init');
        currentHandler = await newApplication.init();
        console.log('done');
        server.on('request', currentHandler);
    }
}

boot();
