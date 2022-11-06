import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Redirect, Res, Session } from '@nestjs/common';
import { CreateDeliveryDto } from 'src/delivery/dtos/CreateDelivery.dto';
import { CreateItemDto } from 'src/item/dtos/CreateItem.dto';
import { UpdateItemDto } from 'src/item/dtos/UpdateItem.dto';
import { CreateProductDto } from 'src/products/dtos/CreateProduct.dto';
import { CreatePromoDto } from 'src/promotion/dtos/CreatePromo.dto';
import { SessionEntity } from 'src/session/Session';
import { CartService } from './cart.service';
import { CreateCartDto } from './dtos/CreateCart.dto';

@Controller('cart')
export class CartController { // kn glowny controller api
    constructor(private cartService: CartService) { }
    //kn fun 8 jeden koszyk nalezy do jednej sesji uzytkownika.


    // kn fun 7
    // generowanie linku do udostepnienia koszyka, czyli dodanie do linku sesji koszyka do skopiowania.
    @Get('share')
    shareCart(@Session() session: Record<string, any>):string {
        return this.cartService.getSharedLink(session.id);
    }
    // kopiowanie koszyka nowego uzykownika(nowa sesja), 
    // jezeli sesjia już istnieje to zwrocenie aktualnego koszyka uzytkownika, 
    // poniewaz uzytkownik wcale nie jest "nowy" 
    // w przeciwnym wypadku, zatwierdzenie sesji i redirect do wlasciwego kopiowania koszyka
    @Get('copy/:id')
    async copyCart(@Session() session: Record<string, any>,
        @Param('id') cartSessionToCopy: string,
        @Res() res: any) {
        const searchedSession = await this.cartService.findSessionById(session.id);
        if (!searchedSession) {
            session.authenticated = true;
            return res.redirect('http://localhost:3000/cart/copied/' + cartSessionToCopy);
        } else {
            return res.redirect('http://localhost:3000/cart/usercart');
        }
    }

    // wlasciwe kopiowanie koszyka
    @Get('copied/:id')
    getCopiedCart(@Session() session: Record<string, any>,
        @Param('id') cartSessionToCopy: string) {
        return this.cartService.copyCart(session.id, cartSessionToCopy);
    }


    //items

    // kn fun 1 Dodawanie przedmiotu do koszyka
    // majac sesjie uzytkownia, json w body {"quantity": np.12}, oraz id produktu,
    // dodajemy "item" - zapis ilosciowy produktu w koszyku.
    @Post('items/:id')
    addItem(@Session() session: Record<string, any>,
        @Body() createItemDto: CreateItemDto,
        @Param('id', ParseIntPipe) prodId: number) {
        return this.cartService.addItem(session.id, createItemDto, prodId);
    }

    // kn fun 3 Zmiana ilości przedmiotu
    // majac id itemu zmieniamy ilosc przedmiotu na ktory wskazuje.
    @Patch('items/:id')
    async updateItem(
        @Session() session: Record<string, any>,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateItemDto: UpdateItemDto
    ) {
        return await this.cartService.changeItemQuantity(session.id, id, updateItemDto);
    }

    // kn fun 2 Usuwanie przedmiotu z koszyka
    @Delete('items/:id')
    async deleteItemFromCart(
        @Session() session: Record<string, any>,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.cartService.deleteCartItem(session.id, id);
    }

    @Get('items')
    getItems(@Session() session: Record<string, any>) {
        return this.cartService.getCartItems(session.id);
    }

    //products
    @Post('prod')
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.cartService.addProduct(createProductDto);
    }

    //carts
    @Get('/carts')
    async getCarts() {
        return this.cartService.findCarts();
    }

    // @Get(':id')
    // getCart(@Param('id', ParseIntPipe) id: number,) {
    //     // return this.cartService.findCart(id);
    // }
    
    //kn fun 6
    //endpoint /cart do pobrania koszyka uzytkownika na podstawie sesji,
    //jeżeli nie ma sesji w db to sesje zatwierdza i redirectuje do stworznia nowego koszyka dla sesji, w przeciwnym wypadku
    //pobiera koszyk dla sesji użytkownika. T
    @Get()
    async getSessionIdCart(@Session() session: Record<string, any>, @Res() res:any) {
        const searchedSession = await this.cartService.findSessionById(session.id);
        if (!searchedSession) {
            session.authenticated = true;
            return res.redirect('http://localhost:3000/cart/session');
        } else {
            return res.redirect('http://localhost:3000/cart/usercart');
        }
    }

    //odpowiednio tworzy nowy koszyk dla sesji  o czym mowa powyzej.
    @Get('session')
    async addUserCart(@Session() session: Record<string, any>) {
        const newCart = await this.cartService.createCart(session.id, { session: null, items: [], delivery: null, sumPrice: 0 });
        return newCart;
    }

    //odpowiednio zwraca aktualny koszyk uzytkownika
    @Get('usercart')
    async getUserCart(@Session() session: Record<string, any>) {
        const searchedSession = await this.cartService.findSessionById(session.id);
        return await this.cartService.findCart(searchedSession);
    }


    // @Get('sessions')
    // async getSessions() {
    //     return this.cartService.findSessions();
    // }



    //delivery
    // kn fun 5 Zmiana typu dostawy (różne ceny za dostawę)
    // ustawienie dostawy zalezy od podanego indeksu dostawy w db.
    // pobierajcac koszt dostawy aktualizuje cene calego koszyka.
    @Patch('delivery/:id')
    setCartDelivery(
        @Session() session: Record<string, any>,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.cartService.setCartDelivery(session.id, id);
    }

    //dodawanie dostawy do db.
    @Post('delivery')
    createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
        return this.cartService.addDelivery(createDeliveryDto);
    }


    // promo
    // dodawanie rabatu do db. w this.cartService.addPromo(createPromoDto) 
    @Post('promo')
    createPromo(@Body() createPromoDto: CreatePromoDto) {
        return this.cartService.addPromo(createPromoDto);
    }

    // kn fun 4
    // dodawanie rabatu do koszyka, musi ten rabat istniec w db.
    // przyjalem ze jezeli rabat jest np 0.8 to bedzie to minus 20 % ,
    // po prostu jak jest mniejszy od 1.0 to oblicza rabat procetowow,
    // a jak rabat >= 1.0 to juz odejmuje kwote od sumy koszyka.
    @Patch('promo/:name')
    setCartPromo(
        @Session() session: Record<string, any>,
        @Param('name') name: string
    ) {
        return this.cartService.setCartPromo(session.id, name);
    }
    
}

