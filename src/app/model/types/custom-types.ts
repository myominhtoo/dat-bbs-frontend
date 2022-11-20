import { TaskCard } from "../bean/taskCard"

export type ChangeStageType = {
    task : TaskCard,
    stageTo : string | number;
}