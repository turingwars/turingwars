import { Array, Boolean, Intersect, Null, Number, Partial, Record, Runtype, Static, String, Union } from 'runtypes';
import { GameUpdate } from '../model/GameUpdate';

export const Hero = Record({
    program: String,
    id: String,
    name: String
});

export type HeroSummary = Static<typeof HeroSummary>;
export const HeroSummary = Record({
    name: String,
    id: String,
    rank: Number,
    score: Number,
    wins: Number,
    losses: Number
});

export interface ResultPage<T> {
    data: T[],
    total: number,
    page: number,
    perPage: number,
    previousPage: number | null,
    nextPage: number | null
};
export const ResultPage = <T>(def: Runtype<T>) => Record({
    data: Array(def),
    total: Number,
    page: Number,
    perPage: Number,
    previousPage: Union(Number, Null),
    nextPage: Union(Number, Null)
});

export const PlaytestRequest = Record({
    opponent: String,
    /**
     * The temporary hero to test
     */
    hero: Record({
        program: String
    })
});
export type PlaytestRequest = Static<typeof PlaytestRequest>;

export type GetGameResponse = Static<typeof GetGameResponse>;
export const GetGameResponse = Intersect(
    Record({
        id: String,
        isOver: Boolean,
        player1Name: String,
        player2Name: String,

    }),
    Partial({
        log: Array(GameUpdate)
    })
);

export const CreateOrUpdateChampionRequest = Intersect(
    Record({
        code: String,
        name: String
    }),
    Partial({
        id: String
    })
);

export const CreateMatchResponse = Record({
    gameId: String
});

export const CreateMatchRequest = Record({
    /**
     * List of champion IDs to load in this game.
     */
    champions: Array(String)
});

export const CommitHeroRequest = Record({
    name: String,
    program: String
});
