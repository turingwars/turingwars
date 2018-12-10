import * as rt from "runtypes";
import { GameUpdate } from 'shared/model/GameUpdate';
import { Engine, EngineConfiguration } from '../../../../lib/engine';
import { UPDATE_PERIOD, CORESIZE, NUM_CYCLES } from 'shared/constants';
import { Assembler } from 'shared/assembler/Assembler';
import { injectable } from 'inversify';

// Types returned by the scala engine
const Outcome = rt.Record({
    winner: rt.Number,
    score1: rt.Number,
    score2: rt.Number
});

const SimulationResult = rt.Record({
    outcome: Outcome,
    frames: rt.Array(GameUpdate)
});
export type SimulationResult = rt.Static<typeof SimulationResult>;

/**
 * Wrapper around the Scala game engine to make it easier to call from TypeScript
 */
@injectable()
export class GameEngine {

    public simulate(code1: string, code2: string): SimulationResult {
        const config: EngineConfiguration = {
            diffFrequency: UPDATE_PERIOD,
            memorySize: CORESIZE,
            nbCycles: NUM_CYCLES
        };

        const engine = new Engine(
            this.loadChampion(code1, 0),
            this.loadChampion(code2, 1),
            JSON.stringify(config)
        );

        return SimulationResult.check(JSON.parse(engine.run()));
    }

    /**
     * Assemble and load champion code to a string.
     */
    private loadChampion(code: string, championNr: number): string {
        const asm = new Assembler({
            id: championNr,
            coresize: CORESIZE
        });
        const program = asm.assemble(code);
        return JSON.stringify(program);
    }
}
