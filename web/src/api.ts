import { createAPI } from './typed-apis/TypedApi';

export interface IHero {
    program: string;
    id: string;
    name: string;
}

export interface IAPIDefinition {
    '/hero/:id': {
        GET: {
            response: IHero,
        },
        PUT: {
            body: IHero,
            response: {
                id: string
            }
        }
    };
    '/heros': {
        GET: {
            response: IHero[]
        }
    }
}

export class Hero {
    public program: string;
    public id: string;
    public name: string;
}

export const twAPI = createAPI({
    getHero: {
        path: '/hero',
        method: 'GET',
        params: {
            id: 'string'
        },
        response: Hero
    }
});
