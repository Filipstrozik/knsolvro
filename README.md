
## KN Solvro Backend Recruitment Task

## Description

This repository is a response to the recruitment task of the Solvro science club.
[link](https://github.com/Solvro/Rekrutacja2022/blob/master/backend/zadanie.md)
As you can see I chose Nest JS Framework and TypeScript.
Initially I used the free SQL database, but after the trial period ended, I came to the local Oracle database.
Main Controller is /cart there are all required functionalities for this task and 
examples you can see on postman collection down here.

## Postman requests collection
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/2a2df4381e501635cc4c?action=collection%2Fimport)


## Endpoints Quick Description
If You are from KN Solvro here are short descriptions of endpoints where key functionalities are implemented:
(Item is a record of product and quantity)

1. Adding a product to the cart:

```bash
#POST
'/cart/items/:id'
#id - product id
Body: 
{
    "quantity": 1
}
```

2. Removing an product from the cart
```bash
#DELETE
'/cart/items/:id'
# item id
```

3. Change the quantity of an item
```bash
#PATCH
'/cart/items/:id'
#id - item id
Body: 
{
    "quantity": 2
}
```

4. Adding a discount(promo) code (percentage and fixed amount)
```bash
#PATCH
'/cart/promo/:name'
#name - discount code (string)
```

5. Change of delivery type (different prices for delivery)
```bash
#PATCH
'/cart/delivery/:id'
#id - delivery id
```

6. Displaying information about the basket.
```bash
#GET
'/cart'
```

7. Sharing the basket (the possibility of sending it to another user, after opening the link, the products should be placed in the new basket of the new user).
```bash
#generate link:
#GET
'/cart/share'

#send link to someone...

#copy cart (as a new user)
#GET
'/cart/copy/:ssesionId'
# just click the link basicly it looks like this:
# cart/copy/8gfXbj-9dKmKcn1OAKBUTMXsuxZUrPW8
```
 
8. Remember that the cart should be placed in the context of a single user session, it cannot be global.
RE: one cart belongs to one user's session in this api.

## Additional enpoints
1. Adding new product
```bash
#POST
'/cart/prod'
Body: 
{
    "title": "banan",
    "desc": "zielony",
    "price": 44
}
```

2. Adding new delivery
```bash
#POST
'/cart/delivery'
Body: 
{
    "type": "Kurier",
    "price": 40
}
```


3. Adding new promotion(discount) (percentage and fixed amount)
```bash
#POST
'/cart/promo'
Body: 
{
    "name": "minusK10",
    "discount": 10
}
OR
Body: 
{
    "name": "minus20",
    "discount": 0.8
}
```
There will be also additional endpoints to make these entities full CRUD functionalities...
## Installation
No node modules are in this repository so You have to download them.
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
# (in progress)
$ npm run test
```

## Stay in touch

- Author - Filip Strózik: filiparkadiuszstrozik@gmail.com

## License

Nest is [MIT licensed](LICENSE).
