import { Endpoint, Api } from './typed-apis/typed-api';
import { ResultPage, HeroSummary, Hero, GetGameResponse, CreateMatchRequest, PlaytestRequest, CreateMatchResponse, CommitHeroRequest } from './dto';
import * as rt from 'runtypes';


export const endpoints = Api({
    getHero: Endpoint({
        path: '/hero',
        method: 'GET',
        params: {
            id: rt.String
        },
        response: Hero
    }),
    commitHero: Endpoint({
        method: 'POST',
        path: '/commitHero',
        body: CommitHeroRequest,
        response: Hero
    }),
    listHeros: Endpoint({
        path: '/heros',
        method: 'GET',
        response: ResultPage(HeroSummary),
        query: {
            page: rt.String
        },
    }),
    getGame: Endpoint({
        path: '/game',
        method: 'GET',
        params: {
            id: rt.String,
        },
        response: GetGameResponse
    }),
    createGame: Endpoint({
        path: '/create-game',
        method: 'POST',
        body: CreateMatchRequest,
        response: CreateMatchResponse
    }),
    playTest: Endpoint({
        path: '/playtest',
        method: 'POST',
        body: PlaytestRequest,
        response: CreateMatchResponse

    })
});
