import { Column, Entity, PrimaryGeneratedColumn, Unique, BaseEntity } from 'typeorm';

@Entity({ orderBy: { score: 'DESC' }})
@Unique(['name'])
export class Champion extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: false })
    public name: string = '';

    @Column({ type: "text" })
    public code: string = '';

    @Column({ default: 0 })
    public score: number;

    @Column({ default: 0 })
    public wins: number;

    @Column({ default: 0 })
    public losses: number;
}
