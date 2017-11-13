import 'reflect-metadata';

import { useContainer as routerUseContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';

import { App } from './App';

routerUseContainer(Container);
ormUseContainer(Container);

const app = Container.get(App);

app.boot().catch((e) => {
    if (e.stack) {
        console.log(e.stack);
    } else {
        throw e;
    }
});
