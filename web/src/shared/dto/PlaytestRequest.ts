import { IsArray, IsDefined } from 'class-validator';

export class PlaytestRequest {

    @IsDefined()
    @IsArray()
    public opponent: string;

    /**
     * The temporary hero to test
     */
    @IsDefined()
    public hero: {
        program: string;
    };
}
