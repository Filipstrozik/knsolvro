import { Item } from 'src/item/item.model';
import { User } from 'src/user/user.model';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Item, (item) => item.cart)
    items: Item[];

}