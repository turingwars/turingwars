import { IHero } from '../../../api';

export function initialState() {
    return {
        heros: [] as IHero[]
    };
}

export type State = ReturnType<typeof initialState>;
