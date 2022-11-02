import { Activity } from "./activity";
import { User } from "./user";

export class Attachment {
    id !: number;
    fileUrl !: string;
    createdDate !: Date;
    file !: File;
    user !: User;
    activity ! : Activity;
}