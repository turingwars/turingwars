import { GET, POST, Api }from './typed-apis/typed-api';
import { ResultPage, HeroSummary, Hero, GetGameResponse, CreateMatchRequest, PlaytestRequest, CreateMatchResponse, CommitHeroRequest } from './dto';
import * as rt from 'runtypes';

export const endpoints = Api({

    getHero: GET `/hero/${'id'}`
        .response(Hero),
        
    getGame: GET `/game/${'id'}`
        .response(GetGameResponse),
        
    commitHero: POST `/commitHero`
        .body(CommitHeroRequest)
        .response(Hero),
        
    listHeros: GET `/heros`
        .response(ResultPage(HeroSummary))
        .query({
            page: rt.String,
            searchTerm: rt.String
        }),
    createGame: POST `/create-game`
        .body(CreateMatchRequest)
        .response(CreateMatchResponse),
        
    playTest: POST `/playtest`
        .body(PlaytestRequest)
        .response(CreateMatchResponse)

});
