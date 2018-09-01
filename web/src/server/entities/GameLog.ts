import { IsDefined } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SQLColumnType_mediumText } from './schemaHelper';

@Entity()
export class GameLog {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @IsDefined()
    public isOver: boolean = false;

    @Column({ nullable: true, type: SQLColumnType_mediumText() })
    public log?: string;

    @Column()
    @IsDefined()
    public player1Name: string;

    @Column()
    @IsDefined()
    public player2Name: string;
}
