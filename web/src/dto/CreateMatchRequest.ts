import { IsArray, IsDefined } from 'class-validator';

export class CreateMatchRequest {

    /**
     * List of champion IDs to load in this game.
     */
    @IsDefined()
    @IsArray()
    public champions: string[];
}
