import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";

@Component({
    selector : 'task-card',
    template : `
     <div (click)="handleShowOffCanvas( task)" class="task-cards my-1 px-2 py-2 pb-4 shadow-sm bg-pale-snow">
        <h5 class="fw-light h6">{{ task.taskName | titlecase }}</h5>
     </div>
    `
})
export class TaskCardComponent{

    @Input('task') task : TaskCard = new TaskCard();
    
    @Output('show-task') showTask = new EventEmitter<TaskCard>();

    handleShowOffCanvas( task : TaskCard ){
        // console.log(taskId);
        this.showTask.emit( task );
    }
}