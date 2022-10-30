import { ISession } from "connect-typeorm/out";
import { Session } from "express-session";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity('sessions') //TODO zmien na 'sessions'
export class SessionEntity implements ISession {

    constructor(id: string) {
        this.id = id;
    }
    
    
    @Column('bigint')
    public expiredAt = Date.now();

    @Index()
    @PrimaryColumn('varchar', { length: 255 })
    public id: string = '';

    @Column('text')
    public json = '';
}