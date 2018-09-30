import * as rt from "runtypes";
import { GameUpdate } from 'shared/model/GameUpdate';

export const EngineRunResult = rt.Array(GameUpdate);
