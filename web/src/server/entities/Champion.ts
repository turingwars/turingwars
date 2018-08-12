import { IsDefined, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';

@Entity()
@Unique(['name'])
export class Champion {

    @PrimaryGeneratedColumn()
    public id: string = '';

    @Column()
    @Index()
    @IsNotEmpty()
    @IsDefined()
    public name: string = '';

    @Column()
    public code: string = '';
}
