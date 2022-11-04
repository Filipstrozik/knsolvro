import { Cart } from "src/cart/cart.model";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Delivery {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    price: number;

    @OneToMany(() => Cart, (cart) => cart.delivery, {cascade: true})
    carts: Cart[];
}