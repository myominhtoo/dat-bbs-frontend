import { COLORS } from './../../model/constant/colors';
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";
import { OnInit } from '@angular/core';
import { TaskCardService } from 'src/app/model/service/http/taskCard.service';
import { ActivityService } from 'src/app/model/service/http/activity.service';
import { CommentService } from 'src/app/model/service/http/comment.service';
import swal from 'sweetalert';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector : 'task-card',
    template : `
     <div (click)="handleShowOffCanvas( task)" class="d-flex task-cards my-0 p-2 gap-2 text-muted shadow-sm bg-pale-snow" style="padding-right:10px;" [style.borderLeft]="task.markColor == null || task.markColor == ''  ? '0.5px solid rgb(206, 202, 202)' : '4px solid '+task.markColor +'!important'  " >
       <div class="d-flex flex-column align-items-star gap-3 w-100" >
        <div class="d-flex justify-content-between w-100">
                <h5 class="fw-light h5">{{ task.taskName | titlecase }} {{ task.comments.length }}</h5>
                <div class="d-flex gap-2 align-items-center">
                    <div (click)="handleGoCommentSection($event)">
                        <i class="fa-regular fa-message"></i>
                        <span *ngIf="task.comments.length > 0" class="badge text-white p-1 bg-danger noti-con fw-light " style="transform:translate(40%,40%);">{{ task.comments.length }}</span>
                    </div>
                     <!-- for achieve taskcard -->
                    <div>
                        <i *ngIf="task.stage.id==3  && !task.deleteStatus" (click)="removeTask($event,task.id)" class="fa-solid fa-xmark" > </i>
                        
                        <i *ngIf="task.stage.id==3 && task.deleteStatus" (click)="restoreTask($event)" class="fa-solid fa-rotate-left text-muted"></i>
                    </div>  
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
        <div class="w-100 d-flex  gap-2 align-items-end {{ !showDonePercent ? 'justify-content-end' : 'justify-content-between' }} " >      
            <div class="d-flex gap-2 align-items-end">
                <span style="font-size:13px;">{{ task.startedDate.toString().replaceAll('-','/') | date : 'dd/MM/yyyy' }}</span>
                <span *ngIf="task.startedDate != task.endedDate"><i class="fa-solid fa-right-long" style="font-size:12px;"></i></span>
                <span *ngIf="task.startedDate != task.endedDate" style="font-size:13px;">{{ task.endedDate.toString().replaceAll('-','/') | date : 'dd/MM/yyyy' }}</span>
            </div>
            <div *ngIf="showDonePercent" style="width:35%;" >
                <small style="font-size:12px;">Done Activity</small>
                <div class="w-100 d-flex align-items-center gap-1">
                    <mat-progress-bar [value]="donePercent"  mode="determinate" ></mat-progress-bar>
                    <small style="font-size:10px;" class="fw-bold thm">{{ donePercent }}%</small>
                </div>
            </div>  
              

        </div>
       </div> 
    `
})
export class TaskCardComponent implements OnInit {

    @Input('task') task : TaskCard = new TaskCard();
    @Output('show-task') showTask = new EventEmitter<TaskCard>();
    @Output('show-comment') showCommentEmitter = new EventEmitter<TaskCard>();
    @Output('delete-task')  emitDeleteTask = new EventEmitter<TaskCard>();
    @Output('restoreDeletedTask')  emitRestoreTask = new EventEmitter<TaskCard>();

    isRequesting : boolean = false;

    colors : string [] = COLORS;
    donePercent : number = 0;
    showDonePercent : boolean = true;

    constructor( 
        private taskCardService : TaskCardService , 
        public route : ActivatedRoute ,
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
        setTimeout(() => {
            this.getActivityDonePercent();
        } , 50 );
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

    getActivityDonePercent(){
        if( this.task.activities.length == 0 ){
            this.showDonePercent = false;
            return;
        }
        this.showDonePercent = true;
        const doneActivityCount = this.task.activities.filter( activity => activity.status ).length;
        this.donePercent = Math.ceil(100 * ( doneActivityCount /  this.task.activities.length ));
    }

    handleGoCommentSection( e : Event ){
        e.stopPropagation();
        this.showCommentEmitter.emit(this.task)
    }

    removeTask(e : Event , id : number){
        e.stopPropagation();
       let boardId = this.route.snapshot.params['boardId'];

        swal({
            text : 'Are you sure to delete TaskCard?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
          }).then(isYes=>{
             this.task.deleteStatus=true;
            this.taskCardService.updateDeleteStatusTask(boardId,id,this.task).subscribe({
                // this.taskCardService.updateTaskCard(this.task).subscribe({
                next: res=>{
                    this.emitDeleteTask.emit(this.task);
                },
                error : err => {
                    console.log(err);
                  }
             })
          });
    
    }

    restoreTask(e : Event){
        e.stopPropagation();
        swal({
            text: 'Are you sure to restore TaskCard?',
            icon: 'warning',
            buttons: ['No','Yes']
        }).then(isYes=>{
            this.task.deleteStatus=false;
            this.taskCardService.updateTaskCard(this.task).subscribe({
                next:res=>{
                    this.emitRestoreTask.emit(this.task);
                    this.task.deleteStatus=false;
                },
                error : err =>{
                    console.log(err);
                }
            })
        })
    }

}