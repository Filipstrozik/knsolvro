import { Cart } from 'src/cart/cart.model';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username:string;

    @Column()
    password: string;

    @Column({default: true})
    isActive: boolean;

    @OneToOne(() => Cart)
    @JoinColumn()
    cart: Cart;
}