import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";
import { OnInit } from '@angular/core';

@Component({
    selector : 'task-card',
    template : `
     <div (click)="handleShowOffCanvas( task)" class="d-flex flex-column align-items-start task-cards my-1 px-2 py-2 gap-3 text-muted shadow-sm bg-pale-snow">
        <h5 class="fw-light h5">{{ task.taskName | titlecase }}</h5>
        <div class="w-100 d-flex justify-content-end gap-2 " style="font-size:13px !important;">
            <span>{{ task.startedDate }}</span>
            <span *ngIf="task.startedDate != task.endedDate">-</span>
            <span *ngIf="task.startedDate != task.endedDate">{{ task.endedDate }}</span>
        </div>
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