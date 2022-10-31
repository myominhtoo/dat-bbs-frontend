import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";
import { OnInit } from '@angular/core';

@Component({
    selector : 'task-card',
    template : `
     <div (click)="handleShowOffCanvas( task)" class="task-cards my-1 px-2 py-2 pb-4 shadow-sm bg-pale-snow">
        <h5 class="fw-light h6">{{ task.taskName | titlecase }}</h5>
        <span>{{ task.startedDate }}</span>
     </div>
    `
})
export class TaskCardComponent implements OnInit {

    @Input('task') task : TaskCard = new TaskCard();
    
    @Output('show-task') showTask = new EventEmitter<TaskCard>();

    ngOnInit() : void {
        // console.log((this.task.startedDate as unknown as Array<number>).toString())
    }

    handleShowOffCanvas( task : TaskCard ){
        this.showTask.emit( task );
    }
}