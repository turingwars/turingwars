import { GameUpdate } from '../model/GameUpdate';

export class GetGameResponse {

    public id: string;

    public isOver: boolean = false;

    public log: GameUpdate[];
}
