import { Board } from "./board";

export class Stage {
    id !: number;
    stageName !: string;
    defaultStatus !: boolean;
    board ! : Board;
}