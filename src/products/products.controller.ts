import { Controller , Post , Body, Get, Param} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController{
    constructor(private productService: ProductsService) {} //dependency injection

    // @Post()
    // addProduct(@Body('title') prodTitle: string):any { getting the tile
    //     this.productService.insertProduct();
    // }

    @Post()
    addProduct(
            //@Body() completeBody: {title:string,....}
        @Body('title') prodTitle: string, 
        @Body('desc') prodDesc: string, 
        @Body('price') prodPrice: number
    ) {
        const generatedId = this.productService.insertProduct(prodTitle, prodDesc, prodPrice);
        return {id: generatedId};
    }

    @Get()
    getAllProducts() {
        return this.productService.getProducts();
    }

    @Get(':id')
    getProduct(@Param('id') prodId: string) {
        return this.productService.getSingleProducts(prodId);
    }
}