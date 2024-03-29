import { TaskCard } from "./taskCard";
import { User } from "./user";

export class Board {
    id !: number;
    boardName !: string;
    createdDate !: Date;
    imageUrl !: string;
    description !: string;
    image !: File;
    deleteStatus !: boolean;
    invitedEmails !: string[];
    user !: User;
    iconColor : string | undefined;  
    code !: number; 
    archivedUsers !: User[];

    /*
     only to display in ui
    */
   color !:string;
   tasks !: TaskCard[];
   members !: User[];
   isArchive !: boolean;
}
