import { Session } from "inspector";
import { Item } from "src/item/item.model";

export class UpdateCartDto {
    sessions: Session;
    items: Item[];
}