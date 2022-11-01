import { Delivery } from 'src/delivery/delivery.model';
import { Item } from 'src/item/item.model';
import { SessionEntity } from 'src/typeorm/Session';
import { User } from 'src/user/user.model';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => SessionEntity)
    @JoinColumn()
    session: SessionEntity;

    @OneToMany(() => Item, (item) => item.cart)
    items: Item[];

    @OneToOne(() => Delivery )
    @JoinColumn()
    delivery: Delivery;
}