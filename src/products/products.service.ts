import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.model';


@Injectable()
export class ProductsService{

    constructor(
        @InjectRepository() private productRepository: Repository<Product>,
    ) {}


    insertProduct(title: string, desc: string, price: number) {
        const prodId = Math.random().toString();
        const newProduct = new Product(prodId, title, desc, price);
        this.products.push(newProduct);
        return prodId;
    }

    getProducts() {
        return [...this.products]; //spreading operator to make a copy not a reference
    }

    getSingleProducts(prodId:string) {
        const product = this.findProduct(prodId)[0];
        return {...product};
    }

    updateProduct(prodId:string, title: string, desc: string, price: number) {
        const [product, index] = this.findProduct(prodId);
        const updatedProduct = {...product};
        if (title) {
            updatedProduct.title = title;
        }
        if (desc) {
            updatedProduct.desc = desc;
        }
        if (price) {
            updatedProduct.price = price;
        }
        this.products[index] = updatedProduct;
    }

    deleteProduct(prodId: string) {
        const index = this.findProduct(prodId)[1];
        this.products.splice(index,1);
    }

    private findProduct(id:string): [Product, number] {
        const productIndex = this.products.findIndex((prod) => prod.id == id);
        const product = this.products[productIndex];
        if (!product) {
            throw new NotFoundException('nie znaleziono produktu');
        }
        return [product, productIndex];
    }



}