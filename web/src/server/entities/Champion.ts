import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Champion {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public name: string = '';

    @Column({ type: "text" })
    public code: string = '';
}
