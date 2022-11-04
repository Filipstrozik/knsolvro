import { Cart } from "src/cart/cart.model";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Promo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    discount: number;

    @OneToMany(() => Cart, (cart) => cart.promo, {cascade: true})
    carts: Cart[];
}