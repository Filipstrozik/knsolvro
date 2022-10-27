import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    desc: string;
    @Column()
    price: number;
}