import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Delivery {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    price: number;
}