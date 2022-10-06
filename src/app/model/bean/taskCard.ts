export class TaskCard {
    id !: number;
    taskName !: string;
    description !: string;
    bookmark !: boolean;
    startedDate !: Date;
    endedDate !: Date;
    deleteStatus !: boolean;
}