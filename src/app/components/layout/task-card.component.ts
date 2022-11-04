import { COLORS } from './../../model/constant/colors';
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";
import { OnInit } from '@angular/core';

@Component({
    selector : 'task-card',
    template : `
     <div (click)="handleShowOffCanvas( task)" class="d-flex task-cards my-0 p-2 gap-2 text-muted shadow-sm bg-pale-snow" style="padding-right:10px;border-left:4px solid #6D6E6F;">
       <div class="d-flex flex-column align-items-star gap-3 w-100" >
        <div class="d-flex justify-content-between w-100">
                <h5 class="fw-light h5">{{ task.taskName | titlecase }}</h5>
                <div class="d-flex gap-1 align-items-center">
                    <div class="dropdown" id="color-dropdown">
                        <i (click)="handleShowColorPlatte($event)" class="fa-solid fa-palette" data-bs-toggle="dropdown" data-bs-target="#color-dropdown"></i>                           
                        <ul class="dropdown-menu p-3">
                            <li style="font-size:14px;">Select Color :</li>
                            <li class="d-flex flex-wrap gap-1 my-2">
                            <p class="p-0 m-0 rounded-0 shadow-sm text-center" style="width:20px;height:20px;" ><i class="fa-solid fa-ban text-muted"></i></p>
                                <p *ngFor="let color of colors" class="p-0 m-0 rounded-0" style="width:20px;height:20px;" [style]="'background:'+color" ></p>
                            </li>
                        </ul>   
                    </div>   
                    <!-- <i class="fas fa-solid fa-minus-circle text-danger opacity-1" ></i> -->
                </div>
            </div>

    
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

    colors : string [] = COLORS;

    ngOnInit() : void {
        // console.log((this.task.startedDate as unknown as Array<number>).toString())
    }

    handleShowOffCanvas( task : TaskCard ){
        this.showTask.emit( task );
    }

    handleShowColorPlatte( e  : Event ){
        e.stopPropagation();

    }
}