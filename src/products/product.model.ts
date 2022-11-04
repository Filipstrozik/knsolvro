import { Item } from 'src/item/item.model';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

    @OneToMany(() => Item, (item) => item.product ,{cascade: true})
    items: Item[];
}