import { Instruction } from './Instruction';
import * as rt from 'runtypes';

export type Program = rt.Static<typeof Program>;
export const Program = rt.Record({
    program: rt.Array(Instruction)
})

/**
 * Constructs a new empty program
 */
export function program(): Program {
    return {
        program: []
    };
}
