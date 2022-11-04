import { Cart } from 'src/cart/cart.model';
import { Product } from 'src/products/product.model';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    @JoinColumn()
    cart: Cart;

    @ManyToOne(() => Product, (product) => product.items)
    @JoinColumn()
    product: Product;

    @Column()
    price: number;
}