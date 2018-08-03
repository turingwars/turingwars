import { IHero } from '../../api';

export function initialState() {
    return {
        message: 'Hello world',
        heros: [] as IHero[]
    };
}

export type State = ReturnType<typeof initialState>;
