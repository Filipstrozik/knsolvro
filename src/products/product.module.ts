import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.model";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";


@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [ProductsController],
    providers: [ProductsService]
})

export class ProductModule {}