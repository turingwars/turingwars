import { IsDefined } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameLog {

    @PrimaryGeneratedColumn()
    public id?: string;

    @Column()
    @IsDefined()
    public isOver: boolean = false;

    @Column({ nullable: true })
    public log?: string;

    @Column()
    @IsDefined()
    public player1Name: string;

    @Column()
    @IsDefined()
    public player2Name: string;
}
