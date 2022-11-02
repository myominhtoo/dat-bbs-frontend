import { Component, EventEmitter, Input, OnInit, Output  } from "@angular/core";
import { Activity } from "src/app/model/bean/activity";
import { ActivityService } from "src/app/model/service/http/activity.service";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { Comment } from "src/app/model/bean/comment";
import { CommentService } from "src/app/model/service/http/comment.service";
import { User } from "src/app/model/bean/user";
import 'emojionearea';
import swal from "sweetalert";
import { ActivatedRoute } from "@angular/router";
import { Board } from "src/app/model/bean/board";
import $ from 'jquery';
import { UserStore } from "src/app/model/service/store/user.store";
import { TaskCard } from "src/app/model/bean/taskCard";
import { Stage } from "src/app/model/bean/stage";

@Component({
    selector : 'task-offcanvas',
    template : `
        <div class='offcanvas offcanvas-end' id='task-offcanvas' >
            <div class="offcanvas-header shadow-sm py-3 px-3">
                <div class="d-flex flex-column w-75">
                    <input (keydown)="handleUpdateTaskName($event)" [(ngModel)]="task.taskName" type="text" [class.is-invalid]="status.errorTask && task.taskName" class="form-control fs-4 fw-bold w-100 outline-none text-capitalize text-muted py-0"  placeholder="Enter task name"  [value]="task.taskName"/>
                    <small class="text-danger" style="font-size:15px;">{{ status.errorTask }}</small>
                </div>{{ task.stage.stageName }}
                <!-- <button class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#task-offcanvas" ></button> -->
                <div id="comment-btn" class="d-flex justify-content-center gap-3 text-muted align-items-center">
                    <!-- <p class="fa-regular fa-comment text-center text-muted p-0 m-0"></p> -->
                    <span id="tab" (click)="changeTab('activity')" [class.fw-bold]="tab == 'activity'" >Activities</span>
                    <span id="tab" (click)="changeTab('comment')" [class.fw-bold]="tab == 'comment'" class="d-flex align-items-center">Comments</span>
                </div>
            </div>
            <div class=" offcanvas-body overflow-scroll py-0 px-2">
                <div *ngIf="tab == 'activity' && !isLoading" class="container py-5">

                   <ul class="list-group list-unstyled text-muted p-3 gap-4">
                     <li class="list-item d-flex ">
                        <h6 class="h6 w-25 fs-6"></h6>
                        <div class="w-75"  style="height:35px;overflow-y:scroll;">
                          <span *ngFor="let assignMember of task.users" class="badge fs-6 fw-light bg-thm mx-1 my-1">{{ assignMember.username | titlecase }}<i (click)="handleRemoveUserFromAssign(assignMember.id)" class="fa-solid fa-xmark mx-2"></i></span>
                        </div>
                     </li>
                      <li class="list-item d-flex ">
                        <h6 class="h6 w-25 fs-6">Assign To</h6>
                        <div class="w-75" *ngIf="members.length > 0">
                           <select class="form-select" (change)="handleAssignTask($event)" >
                             <option selected disabled>Assign Members</option>
                             <option *ngFor="let member of members" class="text-capitalize" [value]="member.id" >{{ member.username }}</option>
                           </select>
                        </div>
                        <div *ngIf="members.length == 0" class="w-75 fs-6">
                            <h5 class="fs-6">There is no member to assign! <span class="link text-primary" (click)="handleInviteMembers()" >Click Here</span> to invite!</h5>
                        </div>
                      </li>
                      <li class="list-item d-flex">
                        <h6 class="h6 w-25 fs-6">Date</h6>
                        <div class="w-75 d-flex gap-2">
                           <div class="w-25">
                                <small>Start Date</small>
                                <input type="date" class="form-control w-100 outlineBtn shadow-none "  [(ngModel)]="task.startedDate" name="startedDate"  />
                           </div>
                            <div class="w-25">
                                <small>Due Date</small>
                                <input type="date" class="form-control w-100 outlineBtn shadow-none" [(ngModel)]="task.endedDate" name="endedDate" />
                            </div>
                        </div>
                      </li>
                      <li class="list-item d-flex">
                        <h6 class="h6 w-25 fs-6">Description</h6>
                        <div class="w-75">
                            <textarea id="input" class="form-control outlineBtn shadow-none" cols="30" rows="5" placeholder="Enter description about task card "[(ngModel)]="task.description" name="description" ></textarea>
                        </div>
                      </li>
                      <li class="text-end">
                         <button (click)="updateTask()" class="btn btn-sm bg-thm px-4 text-light "><i class="fa-solid fa-file-pen mx-1"></i>Update</button>
                      </li>
                   </ul>

                    <!-- activites -->
                    <div class="list-group d-flex flex-column list-unstyled text-muted p-2 gap-3 my-2">

                        <div *ngFor="let activity of activities;let idx = index;" class="w-100 position-relative ">
                            <div class="p-0 w-100  d-flex gap-2 align-items-center ">
                                <input type="checkbox" [checked]="activity.status" [(ngModel)]="activity.status" id=""class="form-check-input shadow-none" name="{{activity.activityName}}" (change)="changeChecked(activity.status,activity.id)" />
                                <input (keydown)="handleAddActivity( $event , idx )" id="activity"  [(ngModel)]="activity.activityName" class="text-muted text-capitalize" [class.is-invalid]="status.errorTargetIdx == idx && status.activityError" />

                            </div>
                            <small class="mx-2 text-danger" *ngIf="status.errorTargetIdx === idx && status.activityError">{{ status.activityError }}</small>
                            <div class=" position-absolute d-flex gap-2" style="right:30px;top:10px;">
                                <i (click)="handleShowDetailActivity( activity.id )" class="fa-solid fa-eye"></i>
                                <!-- <i class="fa-solid fa-calendar-days"></i> -->
                                <input type="file" id="attachment" class="d-none">
                                <label for="attachment" class="fa-solid fa-paperclip"></label>
                            </div>
                        </div>

                    </div>

                    <div class="d-flex justify-content-between align-items-end ">
                        <small class="text-success mx-2">{{ status.msg && status.msg }}</small><br/>
                        <button (click)="setUpAddActivity()" class="btn btn-sm bg-thm text-light mx-3 px-3"><i class="fa-solid fa-plus mx-1"></i>Add Activity</button>
                    </div>
                </div>

                <div *ngIf="tab == 'comment' && !isLoading " id="comments-container" >

                    <div id="comments">
                        <div *ngFor="let comment of comments" id="comment-container" class="w-100 my-2 px-3 ">
                            <div id="comment-icon">
                                <h6 class="h6 mx-2" style="font-size:17px !important;">{{ comment.user.username && comment.user.username | titlecase }}<small class="text-muted mx-2" style="font-size:13px;">{{ comment.createdDate | pentaDate }}</small></h6>
                            </div>
                            <div id="comment">
                                {{ comment.comment }}
                                <div *ngIf="comment.user.id == userStore.user.id" id="comment-control" class="d-flex gap-3 text-muted">
                                   
                                    <span class="d-none" data-bs-toggle="modal" id="editComment" data-bs-target="#cmt-modal"></span>
                                    <i class="fa-solid fa-pen" (click)="updateComment(comment)"></i>
                                    <i class="fa-solid fa-trash" (click)="deleteComment(comment)"></i>
                                </div>
                            </div>                            
                        </div>
                    </div>


                    <!-- <emoji-mart></emoji-mart> -->

                    <div id="comment-send-box">
                        <form (ngSubmit)="handleComment()" class="w-100 d-flex gap-2">
                            <input [(ngModel)]="comment.comment" name="comment" id="cmt-input" type="text" class="form-control w-75" placeholder="Comment Here" />
                            <button type="submit" [disabled]="!comment.comment" class="btn btn-sm w-25 bg-thm text-light"><i class="fa-solid fa-paper-plane mx-1"></i>Send</button>
                        </form>
                    </div>

                </div>

                <div *ngIf="tab == 'activity-detail' && !isLoading " id="comments-container" style="max-height:800px !important;" class="container px-3">

                    <div class="text-muted d-flex align-items-center my-4">
                        <span class="w-25">Activity Name</span>
                        <input type="text" class="form-control w-75 text-capitalize text-muted" [(ngModel)]="detailActivity.activityName" >
                    </div>

                    <div class="text-muted d-flex align-items-center my-4">
                        <span class="w-25">Date</span>
                        <div class="w-75 text-muted d-flex gap-2">
                            <div class="w-25">
                                <small>Start Date</small>
                                <input type="datetime-local" [(ngModel)]="detailActivity.startedDate" class="form-control w-100" />
                           </div>
                            <div class="w-25">
                                <small>Due Date</small>
                                <input type="datetime-local" [(ngModel)]="detailActivity.endedDate" class="form-control w-100">
                            </div>
                        </div>
                    </div>

                    <div class="text-muted d-flex align-items-center my-4">
                        <span class="w-25">Status</span>
                        <div class="w-75 text-muted d-flex justify-content-start  align-items-center ">
                            <div class="w-25 d-flex gap-2 m-0">
                                <label for="undone">Undone</label>
                                <input type="radio" name="status" id="undone" [(ngModel)]="detailActivity.status"   [value]="false" class="form-check">
                            </div>
                            <div class="w-25 d-flex gap-2 m-0">
                                <label for="done">Done</label>
                                <input type="radio" name="status" id="done" [(ngModel)]="detailActivity.status" [value]="true"  class="form-check" />
                           </div>
                        </div>
                    </div>

                    <div class="text-muted d-flex align-items-center my-4">
                        <span class="w-25">Attachments</span>
                        <div class="w-75">
                            <table class="table w-100 text-muted  ">
                                <thead >
                                    <tr>
                                        <td>Name</td>
                                        <td>Uploaded By</td>
                                        <td>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>kt source file</td>
                                        <td>John</td>
                                        <td class="d-flex gap-1 justify-content-center" style="font-size:17px;">
                                           <a class="link"><i class="fa-solid fa-download"></i></a>
                                           <!-- <a class="link"><i class="fa-solid fa-pen-to-square"></i></a>
                                           <a class="link"><i class="fa-solid fa-trash-can"></i></a> -->
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>java file</td>
                                        <td>John</td>
                                        <td class="d-flex gap-1 justify-content-center" style="font-size:17px;">
                                           <a class="link"><i class="fa-solid fa-download"></i></a>
                                           <!-- <a class="link"><i class="fa-solid fa-pen-to-square"></i></a>
                                           <a class="link"><i class="fa-solid fa-trash-can"></i></a> -->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="text-end my-2">
                                <button class="btn btn-secondary btn-sm"><i class="fa-solid fa-plus"></i>Add</button>
                            </div>
                        </div>
                    </div>


                </div>

                <loading [show]="isLoading" target="Activities.."></loading>
            </div>
        </div>
    `
})
export class TaskOffCanvasComponent implements OnInit {


    public now:Date =new Date();

    showtime:Comment[] =[];
    boardId !: number;
    taskCardId !: number;
    activity : Activity= new Activity();
    startedDate !: Date ;
    endedDate !: Date;
    description !: string;
    changeStage :Stage=new Stage();
    changeTask:TaskCard=new TaskCard();

    @Input('task') task : TaskCard = new TaskCard();
    @Input('activities') activities : Activity [] = [];
    @Input('comments') comments : Comment [] = [];
    @Input('isLoading') isLoading : boolean = false;
    @Input('members') members : User [] = [];
    @Input('board') board : Board = new Board();
    @Output('deleteComment') emitDeleteComment = new EventEmitter<Comment>();
    @Input('tasks') tasks : Map<string,TaskCard[]> = new Map();

    @Output('updateComment') emitUpdateComment = new EventEmitter<Comment>();
    tab : string = 'activity';
    detailActivity : Activity = new Activity();
    comment : Comment = new Comment();

    status = {
        isAddActivity : false,
        activityError : '',
        msg : '',
        errorTargetIdx : 0,
        errorTask : '',
    }
    checkActivity: Activity[]=[];

    constructor(
        public route : ActivatedRoute ,
        private activityService : ActivityService ,
        private taskCardService : TaskCardService ,
        private commentService : CommentService ,
        public userStore : UserStore ){
         }

    ngOnInit(): void {
        this.task.users = [];
    }

    changeTab( tab : string ){
        this.tab = tab;
    }

    changeChecked(check:boolean,checkId:number){
        if( !checkId ) return ;
        if(check==true){
            swal({
                text : 'Are you sure ?',
                icon : 'warning',
                buttons : [ 'No' , 'Yes' ]
              }).then( isYes => {
                
                if( isYes ){
                    this.checkActivity=this.activities.filter(res=> {
                        return res.id==checkId
                    });
                    
                    console.log(this.task)

                    this.activityService.updateActivity(this.checkActivity[0]).subscribe({
                        next:(res)=>{
                                this.status.msg = res.message;
                                setTimeout(() => {
                                    this.status.msg = '';
                                } , 500 );                                                
                                this.activityService.getActivities(this.checkActivity[0].taskCard.id).subscribe({
                                    next:(res)=>{
                                    const  prevTaskCardsOfTask = this.tasks.get(this.task.stage.stageName);
                                    this.tasks.set( this.task.stage.stageName , prevTaskCardsOfTask?.filter( task => task.id != this.task.id )!);

                                    if(res.every((res)=> res.status==true)){ 
                                        
                                        this.changeStage.id=3
                                        this.changeTask={...this.task}
                                        this.changeTask.stage=this.changeStage;
                                        this.taskCardService.updateTaskCard( this.changeTask ).subscribe({
                                            next : res => {
                                                this.task = res.data;  
                                                const resultTasks = this.tasks.get(this.task.stage.stageName);
                                                resultTasks?.push(this.task);
                                                this.tasks.set( this.task.stage.stageName , resultTasks! );              
                                                },
                                                error : err => {
                                                    console.log(err);
                                                }});
                                    }else if(res.some((res)=> res.status==true)){
                                        this.changeStage.id=2
                                        this.changeTask={...this.task}
                                        this.changeTask.stage=this.changeStage;
                                        this.taskCardService.updateTaskCard( this.changeTask ).subscribe({
                                            next : res => {
                                                this.task = res.data;                                                  
                                                const resultTasks = this.tasks.get(this.task.stage.stageName);
                                                resultTasks?.push(this.task);
                                                this.tasks.set( this.task.stage.stageName , resultTasks! );
                                                },
                                                error : err => {
                                                    console.log(err);
                                                }});
                                        } 
                                    },error:(res)=>{
                                        console.log(res);
                                    }
                                })
                                                            
                        },error:(err)=>{
                                console.log(err)
                            }
                        }

                    )
                    
                }
                 
              })

        }else{
            
            swal({
                text : 'Are you sure ?',
                icon : 'warning',
                buttons : [ 'No' , 'Yes' ]
              }).then( isYes => {
                
                if( isYes ){
                    this.checkActivity=this.activities.filter(res=> {
                        return res.id==checkId
                    });
                    this.activityService.updateActivity(this.checkActivity[0]).subscribe(
                        {
                            next:(res)=>{
                                    // console.log(res);
                            },error:(err)=>{
                                console.log(err)
                            }
                        }
                    )
                }
                 
              })
        }
    }

    setUpAddActivity(){
    //     // to control clicking this button again & again
    //    if( !this.status.isAddActivity || this.activities.length == 0 ){
    //     this.status.isAddActivity = true;

        const newActivity = new Activity();
        this.activities.push( newActivity );
    //    }
    }

    handleAddActivity( e : KeyboardEvent , targetIdx : number ){
       this.status.activityError = '';
       let curActivityName =  this.activities[ targetIdx ].activityName;
       if( e.code === 'Enter' ){
          if( curActivityName  == '' || curActivityName == null ){
            this.status.activityError = 'Acitiviy is required!';
            return;
          }

         const newActivity = this.activities[ targetIdx ];
         newActivity.taskCard = this.task;         

         if(newActivity.id==undefined){
            this.activityService
            .createActivity( this.activities[ targetIdx ])
            .subscribe({
               next : res => {
                   this.status.msg = res.message;
                   this.activities[ targetIdx ] = res.data;
                   setTimeout(() => {
                       this.status.msg  = "";
                   } , 1000 );
               },
               error : err => {
                  this.status.errorTargetIdx = targetIdx;
                  this.status.activityError = err.error.message;
               }
            });
            this.status.isAddActivity = false;
         }else{
            this.activityService
            .updateActivity( this.activities[ targetIdx ])
            .subscribe({
               next : res => {                   
                this.status.msg = res.message;
                setTimeout(() => {
                    this.status.msg  = "";
                } , 1000 );
               },
               error : err => {
                  this.status.errorTargetIdx = targetIdx;
                  this.status.activityError = err.error.message;
               }
            });
            this.status.isAddActivity = false;
         }

    
       }
    }


    handleShowDetailActivity( activityId : number ){
        this.isLoading = true;
        this.detailActivity = this.activities.filter( activity => activity.id === activityId )[0];
        this.isLoading = false;
        this.tab = 'activity-detail';
    }

    handleUpdateTaskName( e : KeyboardEvent ){
       this.status.errorTask = '';
       if( e.key === 'Enter' ){
            this.taskCardService.updateTaskCard(this.task)
            .subscribe({
                next : res => {
                    this.task = res.data;
                    // console.log(res);
                },
                error : err => {
                    this.status.errorTask = err.error.message;
                }
            });
       }
    }

    handleComment(){
       this.comment.user = new User();
       this.comment.taskCard = new TaskCard();

       this.comment.user.id = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`)))).id;
       this.comment.taskCard.id = this.task.id;

       //console.log(this.comment.taskCard.id);

       this.commentService.createComment( this.comment )
       .subscribe({
        next : res => {
            if( res.ok ){
                const commentsContainer = document.getElementById('comments');
                this.comment.comment = '';
                this.comments.push(res.data);
                commentsContainer?.scrollTo({
                    top : commentsContainer.scrollHeight + 500,
                    behavior : 'smooth'
                })
                console.log(commentsContainer?.scrollHeight)
            }
        },
        error : err => {
            console.log(err);
        }
       })
    }

    handleAssignTask( e : any ){
       let userId = Number(e.target.value);
       if( !this.task.users.some( member => member.id == userId )){
          this.task.users.push(this.members.find( member => member.id == userId )!);
       }
    }

    handleRemoveUserFromAssign( userId : number ){
        this.task.users = this.task.users.filter( user => {
            return user.id != userId;
        });
    }
   
    updateTask(){
     
        this.taskCardService.updateTaskCard( this.task).subscribe({   
                 next : res => {
                   if( res ){
                     swal({
                       text : "successfully!",
                       icon : 'success'
                     })
                  }
                 },
                 error : err => {
                   console.log(err);
                 }
                });
    }

    handleInviteMembers(){
        $('#invite-members').click();
    }


    
  deleteComment(cmt : Comment){ 
    
    swal({
          text : 'Are you sure to Delete ?',
          icon : 'warning',
          buttons : [ 'No' , 'Yes' ]
        }).then( isYes => {
          if (isYes){
            this.commentService.deleteComment(cmt.id).subscribe(data=>{
            this.comments=this.comments.filter(comment=>comment.id != cmt.id);
            });
          }else{
            swal({
              text : 'Fail to Deleted!',
              icon : 'warning'
            })
            }
        })
   }

   updateComment ( comment:Comment ){
      this.emitUpdateComment.emit(comment);
      $("#editComment").click();
   }
}
