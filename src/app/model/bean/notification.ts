import { Board } from "./board";
import { User } from "./user";

export class Notification {
    id ! : number;
    content ! : string;
    createdDate ! : Date;
    board  : Board | undefined | null;
    sentUser !: User;
    seenUsers !:User[];
    invitiation : boolean | undefined | null ;
    targetUser !: User;
    
}