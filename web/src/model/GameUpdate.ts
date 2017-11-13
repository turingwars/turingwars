import { IsArray, IsBoolean, IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Instruction } from './Instruction';

export class GameUpdate {

    @ValidateNested()
    @IsArray()
    public processes: Process[];

    @ValidateNested()
    @IsArray()
    public memory: MemoryUpdate[];

    @ValidateNested()
    @IsArray()
    public score: Score[];
}

export class Process {

    @IsDefined()
    @IsString()
    public processId: string;

    @IsDefined()
    @IsNumber()
    public instructionPointer: number;

    @IsDefined()
    @IsBoolean()
    public isAlive: boolean;
}

export class MemoryUpdate {
    @IsDefined()
    @IsNumber()
    public address: number;

    /**
     * ID of the user who "caused" this mutation
     */
    @IsDefined()
    @IsNumber()
    public cause: number;

    @IsDefined()
    @ValidateNested()
    public value: Instruction;
}

export class Score {
    @IsDefined()
    @IsString()
    public playerId: string;

    @IsDefined()
    @IsNumber()
    public score: number;
}
