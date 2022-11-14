import { COLORS } from './../../model/constant/colors';
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";
import { OnInit } from '@angular/core';
import { TaskCardService } from 'src/app/model/service/http/taskCard.service';
import { Activity } from 'src/app/model/bean/activity';
import { ActivityService } from 'src/app/model/service/http/activity.service';
import { CommentService } from 'src/app/model/service/http/comment.service';
import { Comment } from 'src/app/model/bean/comment';

@Component({
    selector : 'task-card',
    template : `
     <div (click)="handleShowOffCanvas( task)" class="d-flex task-cards my-0 p-2 gap-2 text-muted shadow-sm bg-pale-snow" style="padding-right:10px;" [style.borderLeft]="task.markColor == null || task.markColor == ''  ? '0.5px solid rgb(206, 202, 202)' : '4px solid '+task.markColor +'!important'  " >
       <div class="d-flex flex-column align-items-star gap-3 w-100" >
        <div class="d-flex justify-content-between w-100">
                <h5 class="fw-light h5">{{ task.taskName | titlecase }} {{ task.comments.length }}</h5>
                <div class="d-flex gap-1 align-items-center">
                    <div class="dropdown" id="color-dropdown">
                        <i (click)="handleShowColorPlatte($event)" class="fa-solid fa-palette" data-bs-toggle="dropdown" data-bs-target="#color-dropdown"></i>                           
                        <ul class="dropdown-menu p-3">
                            <li style="font-size:14px;">Select Color :</li>
                            <li class="d-flex flex-wrap gap-1 my-2">
                                <p (click)="handleSetColor( $event,  '')" class="p-0 m-0 rounded-0 shadow-sm text-center" style="width:20px;height:20px;" ><i class="fa-solid fa-ban text-muted"></i></p>
                                <p *ngFor="let color of colors" (click)="handleSetColor($event, color)" class="p-0 m-0 rounded-0" style="width:20px;height:20px;" [style]="'background:'+color" ></p>
                            </li>
                        </ul>   
                    </div>   
                </div>
            </div>    
        <div class="w-100 d-flex justify-content-between gap-2 align-items-center ">     
            <div style="width:35%;">
                <mat-progress-bar value="50" mode="determinate" ></mat-progress-bar>
            </div>      
            <div class="d-flex gap-2 align-items-center">
                <span style="font-size:13px;">{{ task.startedDate.toString().replaceAll('-','/') | date : 'dd/MM/yyyy' }}</span>
                <span *ngIf="task.startedDate != task.endedDate"><i class="fa-solid fa-right-long" style="font-size:12px;"></i></span>
                <span *ngIf="task.startedDate != task.endedDate" style="font-size:13px;">{{ task.endedDate.toString().replaceAll('-','/') | date : 'dd/MM/yyyy' }}</span>
            </div>
        </div>
       </div> 
    `
})
export class TaskCardComponent implements OnInit {

    @Input('task') task : TaskCard = new TaskCard();
    @Output('show-task') showTask = new EventEmitter<TaskCard>();
    isRequesting : boolean = false;

    colors : string [] = COLORS;

    constructor( 
        private taskCardService : TaskCardService , 
        private activityService : ActivityService ,
        private commentService : CommentService ){}

    ngOnInit(): void {
        /*
        initing not to be undefined
        */
        this.task.comments = [];
        this.task.activities = [];

        this.getActivities();
        this.getComments();
    }

    handleShowOffCanvas( task : TaskCard ){
        this.showTask.emit( task );
    }

    handleShowColorPlatte( e  : Event ){
        e.stopPropagation();
    }

    handleSetColor( e : Event , targetColor : string ){
        e.stopPropagation();
        if( !this.isRequesting ){
            this.task.markColor = targetColor;
            this.isRequesting = true;
            this.taskCardService.updateTaskCard(this.task)
            .subscribe({
                next :res => {
                    this.isRequesting = false;
                },
                error :err => {
                    console.log(err);
                }
            });
        }
    }



    getActivities(){
        this.activityService.getActivities( this.task.id )
        .subscribe({
            next : res => {
                this.task.activities = res;
            },
            error : err => {
                console.log(err);
            }
        })
    }

    getComments(){
        this.commentService.getComments( this.task.id )
        .subscribe({
            next : resComments => {
                this.task.comments = resComments;
            },
            error : err => {
                console.log(err);
            }
        })
    }
}