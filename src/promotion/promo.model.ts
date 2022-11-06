import { Cart } from "src/cart/cart.model";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Promo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    discount: number; //kn gdy jest wiekszy lub równy 1.0 to stosowane jest odejmowanie stalej kwoty.

    @OneToMany(() => Cart, (cart) => cart.promo, {cascade: true})
    carts: Cart[];
}