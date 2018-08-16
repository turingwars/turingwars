import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrUpdateChampionRequest {

    @IsString()
    @IsDefined()
    public code: string;

    public id?: string;

    @IsDefined()
    @IsNotEmpty()
    public name: string;
}
