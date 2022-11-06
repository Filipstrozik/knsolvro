import { ISession } from "connect-typeorm/out";
import { Session } from "express-session";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity('sessions') //TODO zmien na 'sessions'
export class SessionEntity implements ISession {

    constructor(id: string) {
        this.id = id;
    }
    
    
    @Column('number')
    public expiredAt: number = Date.now();

    @PrimaryColumn({ length: 255 })
    public id: string = '';

    @Column()
    public json: string = '';
}