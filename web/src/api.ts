import { CreateMatchRequest } from './dto/CreateMatchRequest';
import { CreateMatchResponse } from './dto/CreateMatchResponse';
import { GetGameResponse } from './dto/GetGameResponse';
import { createAPI } from './typed-apis/typed-api';
import { PlaytestRequest } from './dto/PlaytestRequest';


// This is an experiment to provide a comfortable way to define typed APIs to tie together
// the back- end front-ends in a type-safe way.
// I am not yet satisfied with the way it looks and welcome any suggestion.

export class Hero {
    public program: string;
    public id: string;
    public name: string;
};

export interface HeroSummary {
    name: string;
    id: string;
}

export class ResultPage<T> {
    public data: T[];
    public total: number;
    public page: number;
    public perPage: number;
    public previousPage: number | null;
    public nextPage: number | null;
}

// TODO: specifying a wrong property does not trigger an error...

export const twAPI = createAPI({
    getHero: {
        path: '/hero',
        method: 'GET',
        params: {
            id: 'string'
        },
        response: Hero
    },
    commitHero: {
        method: 'POST',
        path: '/commitHero',
        body: {
            name: 'string',
            program: 'string'
        },
        response: Hero
    },
    listHeros: {
        path: '/heros',
        method: 'GET',
        response: new ResultPage<HeroSummary>(),
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
    },
    playTest: {
        path: '/playtest',
        method: 'POST',
        body: PlaytestRequest,
        response: CreateMatchResponse
    }
});
