import { TaskCard } from "./taskCard";

export class Activity {
    id !: number;
    activityName !: string;
    status !: boolean;
    startedDate !: Date;
    endedDate !: Date;
    taskCard !: TaskCard;
}