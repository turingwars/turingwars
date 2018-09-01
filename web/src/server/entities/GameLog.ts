import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SQLColumnType_mediumText } from './schemaHelper';

@Entity()
export class GameLog {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public isOver: boolean = false;

    @Column({ nullable: true, type: SQLColumnType_mediumText() })
    public log?: string;

    @Column({ nullable: false })
    public player1Name: string;

    @Column({ nullable: false })
    public player2Name: string;
}
