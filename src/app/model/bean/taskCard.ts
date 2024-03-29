import { Activity } from "./activity";
import { Board } from "./board";
import { Comment } from "./comment";
import { Stage } from "./stage";
import { User } from "./user";

export class TaskCard {
    id !: number;
    taskName !: string;
    description !: string;
    bookmark !: boolean;
    startedDate !: Date;
    endedDate !: Date;
    deleteStatus !: boolean;
    board! : Board;
    activities ! : Activity[];
    stage ! : Stage;
    users ! : User[];
    markColor !: string;
    comments ! : Comment [] ;

    commentCount ! : number;
}