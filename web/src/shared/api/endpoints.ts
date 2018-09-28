import * as api from './typed-apis/typed-api';
import { ResultPage, HeroSummary, Hero, GetGameResponse, CreateMatchRequest, PlaytestRequest, CreateMatchResponse, CommitHeroRequest } from './dto';
import * as rt from 'runtypes';

export const endpoints = api.Api({
    getHero: api.endpoint`/hero/${'id'}`
        .method('GET')
        .response(Hero),
        
    getGame: api.endpoint`/game/${'id'}`
        .method('GET')
        .response(GetGameResponse),
        
    commitHero: api.endpoint('/commitHero')
        .method('POST')
        .body(CommitHeroRequest)
        .response(Hero),
        
    listHeros: api.endpoint('/heros')
        .method('GET')
        .response(ResultPage(HeroSummary))
        .query({
            page: rt.String
        }),
        
    createGame: api.endpoint('/create-game')
        .method('POST')
        .body(CreateMatchRequest)
        .response(CreateMatchResponse),
        
    playTest: api.endpoint('/playtest')
        .method('POST')
        .body(PlaytestRequest)
        .response(CreateMatchResponse)
});
