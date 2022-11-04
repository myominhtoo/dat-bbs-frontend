import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";
import { OnInit } from '@angular/core';
import { Board } from "src/app/model/bean/board";

@Component({
    selector : 'task-card',
    template : `
     <div (click)="handleShowOffCanvas( task)" class="d-flex flex-column align-items-start task-cards my-1 px-2 py-2 gap-3 text-muted shadow-sm bg-pale-snow">
        <h5 class="fw-light h5">{{ task.taskName | titlecase }}</h5>
            <!-- <span data-bs-toggle="dropdown">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </span> -->
        <div class="w-100 d-flex justify-content-end gap-2 align-items-center ">
            
            <span style="font-size:13px;">{{ task.startedDate.toString().replaceAll('-','/') | date : 'dd/MM/yyyy' }}</span>
            <span *ngIf="task.startedDate != task.endedDate"><i class="fa-solid fa-right-long" style="font-size:12px;"></i></span>
            <span *ngIf="task.startedDate != task.endedDate" style="font-size:13px;">{{ task.endedDate.toString().replaceAll('-','/') | date : 'dd/MM/yyyy' }}</span>
        </div>
     </div>
    `
})
export class TaskCardComponent implements OnInit {

    @Input('task') task : TaskCard = new TaskCard();
    //@Input('board') board : Board= new Board();
    @Output('show-task') showTask = new EventEmitter<TaskCard>();

    ngOnInit() : void {
        // console.log((this.task.startedDate as unknown as Array<number>).toString())
    }

    handleShowOffCanvas( task : TaskCard ){
        this.showTask.emit( task );
    }
}