import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Redirect, Res, Session} from '@nestjs/common';
import { CreateDeliveryDto } from 'src/delivery/dtos/CreateDelivery.dto';
import { CreateItemDto } from 'src/item/dtos/CreateItem.dto';
import { UpdateItemDto } from 'src/item/dtos/UpdateItem.dto';
import { CreateProductDto } from 'src/products/dtos/CreateProduct.dto';
import { CreatePromoDto } from 'src/promotion/dtos/CreatePromo.dto';
import { SessionEntity } from 'src/typeorm/Session';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/CreateCart.dto';

@Controller('cart')
export class CartController {

    constructor(private cartService: CartService) {} 

    @Get('share')
    shareCart(@Session() session: Record<string, any>) {
        return this.cartService.getSharedLink(session.id);
    }

    //items
    @Post('items/:id')
    addItem(@Session() session: Record<string, any>,
                @Body() createItemDto: CreateItemDto,
                @Param('id', ParseIntPipe) prodId: number){
        return this.cartService.addItem(session.id, createItemDto, prodId);
    }

    @Get('items')
    getItems(@Session() session: Record<string, any>) {
        return this.cartService.getCartItems(session.id);
    }

    @Patch('items/:id')
    async updateItem(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateItemDto: UpdateItemDto
    ) {
        return await this.cartService.changeItemQuantity(id, updateItemDto);
    }

    @Delete('items/:id') 
    deleteItemFromCart(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.cartService.deleteCartItem(id);
    }

    //products
    @Post('prod')
    createProduct(@Body() createProductDto: CreateProductDto){
        return this.cartService.addProduct(createProductDto);
    }

    //carts
    @Get('/carts') 
    async getCarts() {
        return this.cartService.findCarts();
    }

    @Get('session')
    async addUserCart(@Session() session: Record<string, any>){
        // const searchedSession = await this.cartService.findSessionById(session.id);
        console.log('redirected to session...');
        const newCart = await this.cartService.createCart(session.id, {session: null, items:[], delivery:null, sumPrice:0});
        return newCart;
    }
    
    @Get('usercart')
    async getUserCart(@Session() session: Record<string, any>){
        console.log('redirected to usercart...');
        const searchedSession = await this.cartService.findSessionById(session.id);
        return await this.cartService.findCart(searchedSession);
    }

     
    @Get(':id')
    getCart(@Param('id', ParseIntPipe) id: number,) {
        // return this.cartService.findCart(id);
    }

    @Get('')
    // @Redirect('http://localhost:3000/cart/session', 201) // get cart assigned to user session id
    async getSessionIdCart(@Session() session: Record<string, any>, @Res() res) {
        console.log(session.id);
        const searchedSession = await this.cartService.findSessionById(session.id);
        // console.log(searchedSession);
        if(!searchedSession){
            console.log("NO session in db");
            //create new cart with session id
            session.authenticated = true;

            return res.redirect('http://localhost:3000/cart/session');
        } else {
            console.log('session in db');

            // return this.cartService.findSessions();
            return res.redirect('http://localhost:3000/cart/usercart');
        }
        
    }

    @Get('sessions')
    async getSessions(){
        return this.cartService.findSessions();
    }



    //delivery


    @Patch('delivery/:id')
    setCartDelivery(
        @Session() session: Record<string, any>,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.cartService.setCartDelivery(session.id, id);
    }

    @Post('delivery')
    createDelivery(@Body() createDeliveryDto: CreateDeliveryDto){
        return this.cartService.addDelivery(createDeliveryDto);
    }


    //promo
    @Post('promo')
    createPromo(@Body() createPromoDto: CreatePromoDto){
        return this.cartService.addPromo(createPromoDto);
    }

    @Patch('promo/:name')
    setCartPromo(
        @Session() session: Record<string, any>,
        @Param('name') name: string
    ) {
        return this.cartService.setCartPromo(session.id, name);
    }




    //sharing cart to new user
    //generating

    //copy

    @Get('copy/:id')
    async copyCart(@Session() session: Record<string, any>,
            @Param('id') cartSessionToCopy: string,
            @Res() res) {

            const searchedSession = await this.cartService.findSessionById(session.id);
            if(!searchedSession){
                    console.log("NO NEW session in db");
                    //create new cart with session id
                    session.authenticated = true;


                    return res.redirect('http://localhost:3000/cart/copied/' + cartSessionToCopy);
                } else {
                    console.log('session in db');

                    return res.redirect('http://localhost:3000/cart/usercart');
                }
        
    }


    @Get('copied/:id')
    getCopiedCart(@Session() session: Record<string, any>,
                @Param('id') cartSessionToCopy: string ){
        console.log('copy the cart!');
        console.log(session.id);
        return this.cartService.copyCart(session.id, cartSessionToCopy);
    }

    
}

