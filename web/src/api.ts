import { CreateMatchRequest } from './dto/CreateMatchRequest';
import { CreateMatchResponse } from './dto/CreateMatchResponse';
import { GetGameResponse } from './dto/GetGameResponse';
import { createAPI, UnwrapConstructor } from './typed-apis/typed-api';


// This is an experiment to provide a comfortable way to define typed APIs to tie together
// the back- end front-ends in a type-safe way.
// I am not yet satisfied with the way it looks and welcome any suggestion.

export class Hero {
    public program: string;
    public id: string;
    public name: string;
};


export class ResultPage<T> {
    public data: T[];
    public total: number;
    public page: number;
    public perPage: number;
    public previousPage: number | null;
    public nextPage: number | null;
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
        response: new ResultPage<UnwrapConstructor<Hero>>(),
        query: {
            page: 'string'
        },
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
