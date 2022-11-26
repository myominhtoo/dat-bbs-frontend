import { COLORS } from './../../model/constant/colors';
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TaskCard } from "src/app/model/bean/taskCard";
import { OnInit } from '@angular/core';
import { TaskCardService } from 'src/app/model/service/http/taskCard.service';
import { ActivityService } from 'src/app/model/service/http/activity.service';
import { CommentService } from 'src/app/model/service/http/comment.service';
import swal from 'sweetalert';
import { ActivatedRoute } from '@angular/router';
import { Comment } from 'src/app/model/bean/comment';
import { CommentStore } from 'src/app/model/service/store/comment.store';


@Component({
    selector : 'task-card',
    template : `
     <div (click)="handleShowOffCanvas( task)" class="d-flex task-cards my-0 p-2 gap-2 text-muted shadow-sm bg-pale-snow" style="padding-right:10px;" [style.borderLeft]="task.markColor == null || task.markColor == ''  ? '0.5px solid rgb(206, 202, 202)' : '4px solid '+task.markColor +'!important'  " >
        <div class="d-flex flex-column align-items-star gap-3 w-100 " >
            <div class="d-flex justify-content-between w-100">
                    <div class="w-75">
                        <h5 class="fw-light" style="white-space:break-spaces;">{{ task.taskName | titlecase }}</h5>
                    </div>
                    <div class="d-flex gap-2 align-items-center">
                        <div (click)="handleGoCommentSection($event)">
                            <i class="fa-regular fa-message"></i>
                            <span *ngIf="task.comments.length > 0" class="badge text-white p-1 bg-danger noti-con fw-light " style="transform:translate(40%,40%);">{{ task.comments.length }}</span>
                        </div>
                        <!-- for achieve taskcard -->
                        <div>
                            <i *ngIf="task.stage.id==3  && !task.deleteStatus" (click)="removeTask($event,task.id)" class="fa-solid fa-xmark" > </i>

                            <i *ngIf="task.stage.id==3 && task.deleteStatus" (click)="restoreTaskCard($event,task.id)" class="fa-solid fa-rotate-left text-muted"></i>
                        </div>
                        <div class="dropdown p-0 m-0" id="color-dropdown">
                            <i (click)="handleShowColorPlatte($event)" class="fa-solid fa-palette" data-bs-toggle="dropdown" data-bs-target="#color-dropdown"></i>
                            <ul class="dropdown-menu p-3">
                                <li style="font-size:16px;">Select Color :</li>
                                <li class="d-flex flex-wrap justify-content-center gap-1 my-2">
                                    <p (click)="handleSetColor( $event,  '')" class="p-0 m-0 rounded-0 shadow-sm text-center" style="width:20px;height:20px;" ><i class="fa-solid fa-ban text-muted"></i></p>
                                    <p *ngFor="let color of colors" (click)="handleSetColor($event, color)" class="p-0 m-0 rounded-0" style="width:20px;height:20px;" [style]="'background:'+color" ></p>
                                </li>
                            </ul>
                        </div>
                    </div> 
                </div>
            <div class="w-100 d-flex  gap-2 align-items-end justify-content-between " >
                <div class="d-flex gap-2 align-items-end {{ taskStatus == PERIOD_STATUS.OVER && taskColor }} " [style]="'color:'+taskColor +'!important'">
                    <span style="font-size:13px;">{{ task.startedDate.toString().replaceAll('-','/').replace('T',' ') | date : 'dd/MM/yyyy' }}</span>
                    <span *ngIf="task.startedDate != task.endedDate"><i class="fa-solid fa-right-long" style="font-size:12px;"></i></span>
                    <span *ngIf="task.startedDate != task.endedDate" style="font-size:13px;">{{ task.endedDate.toString().replaceAll('-','/').replace('T',' ') | date : 'dd/MM/yyyy' }}</span>
                </div>
                <div *ngIf="!task.deleteStatus" class="text-end d-flex flex-column" style="width:35%;" >
                    <!-- <small *ngIf="taskStatus != PERIOD_STATUS.OK" style="font-size:10px;">{{ taskStatus }}</small> -->
                    <small style="font-size:12px;">{{ showDonePercent ? 'Done Activity' : 'No Activity' }}<i class="fa-solid fa-circle ms-2 {{ taskColor }}" [style]="'color:'+ taskColor + ' !important' " ></i></small>
                    <div class="w-100 d-flex align-items-center gap-1">
                        <mat-progress-bar [value]="donePercent"  mode="determinate" [color]="(taskStatus == PERIOD_STATUS.OVER) && 'warn'"></mat-progress-bar>
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

    childCommentsMap : Map<number,Comment[]> = new Map();

    PERIOD_STATUS  = {
        OVER : 'Overdue',
        CLOSE : 'Very Close',
        FAR : 'Very Far',
        OK : 'ok'
    };

    taskStatus = this.PERIOD_STATUS.OK;
    taskColor = '';

    constructor(
        private taskCardService : TaskCardService ,
        public route : ActivatedRoute ,
        private activityService : ActivityService ,
        private commentService : CommentService , 
        private commentStore : CommentStore ){
        }

    ngOnInit(): void {
        /*
        initing not to be undefined
        */
        this.task.comments = [];
        this.task.activities = [];

        this.taskColor = this.getTaskColorWithPeriod() !;
        
        this.getActivities();
        this.getComments();
        setTimeout(() => {
            this.getActivityDonePercent();
        } , 500 );

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
       
              const childComments: Comment[] = [];
              this.task.comments = resComments.filter( comment => {
                 if( comment.parentComment != null ){
                    comment.childComments = [];
                    childComments.push(comment);
                    return false;
                 }
                 comment.childComments = [];
                 return true;
              });

              childComments.forEach( childComment => {
                const parentId = childComment.parentComment.id;
                const parentData = this.childCommentsMap.get(parentId)!;
                childComment.childComments = [];
                
                if( parentData == undefined ){
                    this.childCommentsMap.set( parentId , [childComment]);
                    return;
                }
                parentData.push(childComment);
                this.childCommentsMap.set( parentId , parentData );
              });

              this.commentStore.commentsMap.set( this.task.id , this.childCommentsMap! );

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
        // test
        let date =this.task.startedDate.toString().replaceAll('T','');
        console.log(date);
     
       let boardId = this.route.snapshot.params['boardId'];

        swal({
            text : 'Are you sure to delete TaskCard?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
          }).then(isYes=>{
            if(isYes){
             this.task.deleteStatus=true;
            this.taskCardService.updateDeleteStatusTask(boardId,id,this.task).subscribe({
                // this.taskCardService.updateTaskCard(this.task).subscribe({
                next: res=>{
                    this.emitDeleteTask.emit(this.task);
                },
                error : err => {
                    console.log(err);
                  }
             })}
          });

    }

    restoreTaskCard(e : Event , id : number){
      let boardId = this.route.snapshot.params['boardId'];
        e.stopPropagation();
        swal({
            text: 'Are you sure to restore TaskCard?',
            icon: 'warning',
            buttons: ['No','Yes']
        }).then(isYes=>{
            if ( isYes){
            this.task.deleteStatus=false;
            this.taskCardService.restoreTask(id,boardId,this.task).subscribe({
                next:res=>{
                    this.emitRestoreTask.emit(this.task);
                    this.task.deleteStatus=false;
                },
                error : err =>{
                    console.log(err);
                }
            })}
        })
    }

    getPeriodStatus( start : Date , end : Date ){
        if( start == end  ) return this.PERIOD_STATUS.OK;
        const startInHour = Math.round(new Date(start).getTime() / 3600000);
        const endInHour = Math.round(new Date(end).getTime() / 3600000);
        const curInHour = Math.round(new Date().getTime() / 3600000);
        const realPeriod = endInHour - startInHour;
        const remainPeriod = endInHour - curInHour;

        const remainPercent = (remainPeriod/realPeriod) * 100;

        if( remainPercent >= 80 && remainPercent > 50  ){
            return this.PERIOD_STATUS.FAR;
        }
        else if( remainPercent <= 50 && remainPercent > 0 ){
            return this.PERIOD_STATUS.CLOSE;
        }else if( remainPercent < 0 ){
            return this.PERIOD_STATUS.OVER;
        }else{
            return this.PERIOD_STATUS.OK;
        }
    }

    getTaskColorWithPeriod(){
        const periodStatus = this.getPeriodStatus( this.task.startedDate , this.task.endedDate );
        this.taskStatus = periodStatus;

        if( periodStatus == this.PERIOD_STATUS.OK ){
            return 'text-primary';
        }
        if( periodStatus == this.PERIOD_STATUS.FAR ){
            return 'green';
        }
        if( periodStatus == this.PERIOD_STATUS.OVER ){
            return 'text-danger'
        }
        if( periodStatus == this.PERIOD_STATUS.CLOSE ){
            return 'text-warning';
        }
        return '';
    }

}
