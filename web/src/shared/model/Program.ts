import { IsArray, ValidateNested } from 'class-validator';

import { Instruction } from './Instruction';

export class Program {

    @IsArray()
    @ValidateNested()
    public program: Instruction[] = [];
}
