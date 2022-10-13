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
}
