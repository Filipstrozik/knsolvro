import { Controller , Post , Body, Get, Param, Patch, Delete, Put} from '@nestjs/common';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController{
    constructor(private productService: ProductsService) {} //dependency injection

    @Post()
    addProduct(
        @Body() createProductDto: CreateProductDto
    ) {
        const generatedId = this.productService.createProduct(createProductDto);
        return {id: generatedId};
    }

    @Get()
    async getAllProducts() {
        return this.productService.getProducts();
    }

    @Get(':id')
    getProduct(@Param('id') prodId: number) {
        return this.productService.getSingleProducts(prodId);
    }

    @Put(':id')
    async updateProduct(
        @Param('id') prodId: number, 
        @Body() updateProductDto: UpdateProductDto
    ) {
        await this.productService.updateProduct(prodId, updateProductDto);
    }


    @Delete(':id')
    async removeProduct(@Param('id') prodId: number) {
        await this.productService.deleteProduct(prodId);
    }
}