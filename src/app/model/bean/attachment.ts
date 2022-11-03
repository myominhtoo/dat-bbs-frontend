import { Activity } from "./activity";
import { User } from "./user";

export class Attachment {
    id !: number;
    name ! : string;
    fileUrl !: string;
    createdDate !: Date;
    file !: File;
    user !: User;
    activity ! : Activity;
}