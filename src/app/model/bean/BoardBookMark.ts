import { Board } from "./board";
import { User } from "./user";

export class BoardBookMark{
    id ! : number;
    user ! : User;
    board ! : Board;
    createdDate ! : Date;
}