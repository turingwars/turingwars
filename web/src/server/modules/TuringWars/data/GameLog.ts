import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
import { SQLColumnType_mediumText } from './dbUtils';

@Entity()
@Index(["player1Id", "player2Id"], { unique: true })
export class GameLog {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public isOver: boolean = false;

    @Column({ nullable: true, type: SQLColumnType_mediumText() })
    public log?: string;

    @Column({ nullable: false })
    public player1Id: number;

    @Column({ nullable: false })
    public player2Id: number;

    @Column({ nullable: false })
    public player1Name: string;

    @Column({ nullable: false })
    public player2Name: string;

    @Column({ nullable: true })
    public player1EndScore: number;

    @Column({ nullable: true })
    public player2EndScore: number;

    /**
     * 0-indexed position of the winner. -1 = draw
     */
    @Column({ default: -1 })
    public winner: number;
}
