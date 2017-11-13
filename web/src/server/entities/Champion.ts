import { IsDefined, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CreateOrUpdateChampionRequest } from '../../dto/CreateOrUpdateChampionRequest';

@Entity()
export class Champion {

    public static fromRequest(req: CreateOrUpdateChampionRequest): Champion {
        const entity = new Champion();
        Object.assign(entity, req); // YOLO!
        return entity;
    }

    @PrimaryGeneratedColumn()
    public id?: string;

    @Column()
    @IsNotEmpty()
    @IsDefined()
    public name: string;

    @Column()
    public code: string;
}
