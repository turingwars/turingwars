import * as http from 'http';
import application from './server';
import { SERVER_PORT } from '../config';


async function boot() {
    const handler = await application.init();
    const server = http.createServer(handler);
    
    let currentHandler = handler;
    let currentApp = application;

    server.listen(SERVER_PORT, () => {
        console.log(`Server is listening on port ${SERVER_PORT}`);
    });

    if (module.hot) {
        module.hot.accept('./server', function () {
            console.log('Called with arguments')
            console.log(arguments);
            replace();
        });
    }
    async function replace() {
        const application = require('./server').default;
        console.log('Receiving update');
        server.removeListener('request', currentHandler);
        console.log('reoved');
        await currentApp.teardown();
        console.log('torn down');
    
        currentApp = application;
        console.log('will init');
        currentHandler = await application.init();
        console.log('done');
        server.on('request', currentHandler);
    }
}


boot();
