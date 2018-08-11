import { GameUpdate } from '../model/GameUpdate';

export class GetGameResponse {

    public id: string;

    public isOver: boolean = false;

    public player1Name: string;
    public player2Name: string;

    public log?: GameUpdate[];
}
