import { Board } from "./board";
import { User } from "./user";

export class BoardsHasUsers {
  id ! : number;
  board! : Board;
  user! : User;
  joinedStatus ! : boolean;
  joinedDate ! : Date;
}
