import { Session } from "inspector";
import { Item } from "src/item/item.model";
import { SessionEntity } from "src/typeorm/Session";

export class UpdateCartDto {
    sessions: SessionEntity;
    items: Item[];
}