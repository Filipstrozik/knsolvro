import { Session } from "inspector";
import { Item } from "src/item/item.model";

export class CreateCartDto {
    session: Session;
    items: Item[];
}