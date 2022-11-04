import { Delivery } from 'src/delivery/delivery.model';
import { Item } from 'src/item/item.model';
import { SessionEntity } from 'src/typeorm/Session';
import { User } from 'src/user/user.model';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 0})
    sumPrice: number;

    @OneToOne(() => SessionEntity)
    @JoinColumn()
    session: SessionEntity;

    @OneToMany(() => Item, (item) => item.cart, {
        cascade: true,
    })
    items: Item[];

    @ManyToOne(() => Delivery, (delivery) => delivery.carts)
    @JoinColumn()
    delivery: Delivery;
}