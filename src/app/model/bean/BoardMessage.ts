import { User } from './user';
import { Board } from './board';
export class BoardMessage{
    id !: number;
    content !: string;
    createdDate !: Date;
    board!:Board;
    user!:User;
    file!:File;
}   