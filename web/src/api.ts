import { CreateMatchRequest } from './dto/CreateMatchRequest';
import { CreateMatchResponse } from './dto/CreateMatchResponse';
import { GetGameResponse } from './dto/GetGameResponse';
import { createAPI } from './typed-apis/typed-api';

export interface IHero {
    program: string;
    id: string;
    name: string;
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
    },
    saveHero: {
        path: '/hero',
        method: 'PUT',
        params: {
            id: 'string' // TODO: This api sucks, plus needs optional parameters
        },
        body: Hero,
        response: Hero
    },
    getAllHeros: {
        path: '/heros',
        method: 'GET',
        response: [Hero]
    },
    getGame: {
        path: '/game',
        method: 'GET',
        params: {
            id: 'string',
        },
        response: GetGameResponse
    },
    createGame: {
        path: '/create-game',
        method: 'POST',
        body: CreateMatchRequest,
        response: CreateMatchResponse
    }
});
