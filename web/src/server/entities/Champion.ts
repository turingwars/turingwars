import { IsDefined, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Champion {

    @PrimaryGeneratedColumn()
    public id: string = '';

    @Column()
    @IsNotEmpty()
    @IsDefined()
    public name: string = '';

    @Column()
    public code: string = '';
}
