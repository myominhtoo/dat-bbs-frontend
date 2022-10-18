import { Component, Input } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";

@Component({
    selector : 'task-card',
    template : `
     <div cdkDrag class="task-cards my-1  px-2 py-3 text-muted">
        <h5 class="text-muted h6">{{ task.taskName }}</h5>
     </div>
    `
})
export class TaskCardComponent{
    @Input('task') task : TaskCard = new TaskCard();
}