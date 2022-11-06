import { Session } from "inspector";
import { Item } from "src/item/item.model";
import { SessionEntity } from "src/session/Session";

export class CreateCartDto {
    session: SessionEntity;
    items: Item[];
}