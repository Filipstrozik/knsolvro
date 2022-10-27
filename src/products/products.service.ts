import { Injectable , NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductParams, UpdateProductParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { Product } from './product.model';


@Injectable()
export class ProductsService{

    constructor(
        @InjectRepository(Product) private productRepository: Repository<Product>,
    ) {}


    createProduct(productDetails: CreateProductParams) {
        const newProduct = this.productRepository.create({...productDetails})
        return this.productRepository.save(newProduct);
    }

    getProducts() {
        return this.productRepository.find();
    }

    getSingleProducts(id: number) {
        return this.productRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    updateProduct(id:number, productDetails: UpdateProductParams) {
        return this.productRepository.update({id},{ ...productDetails });
    }

    deleteProduct(id: number) {
        return this.productRepository.delete({id});
    }

    // private findProduct(id:string): [Product, number] {
    //     const productIndex = this.products.findIndex((prod) => prod.id == id);
    //     const product = this.products[productIndex];
    //     if (!product) {
    //         throw new NotFoundException('nie znaleziono produktu');
    //     }
    //     return [product, productIndex];
    // }



}