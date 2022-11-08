import { Board } from "./board";

export class Notification {
    id ! : number;
    content ! : string;
    createdDate ! : Date;
    board ! : Board;
}