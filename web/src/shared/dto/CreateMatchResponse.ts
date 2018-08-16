import { IsDefined, IsString } from 'class-validator';

export class CreateMatchResponse {

    @IsDefined()
    @IsString()
    public gameId: string;
}
