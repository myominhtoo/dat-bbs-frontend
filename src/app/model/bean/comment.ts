import { TaskCard } from "./taskCard";
import { User } from "./user";

export class Comment{
    id !: number;
    comment !: string;
    createdDate !: Date;
    user ! : User;
    taskCard ! : TaskCard;
}