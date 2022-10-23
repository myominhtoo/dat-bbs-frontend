import { Component, Input } from "@angular/core";
import { Activity } from "src/app/model/bean/activity";
import { TaskCard } from "src/app/model/bean/taskCard";
import { ActivityService } from "src/app/model/service/http/activity.service";

@Component({
    selector : 'task-offcanvas',
    template : `
        <div class='offcanvas offcanvas-end' id='task-offcanvas' >
            <div class="offcanvas-header shadow-sm p-1 px-3">
                <input type="text" class="form-control fs-4 fw-bold w-75 outline-none text-capitalize text-muted py-1"  placeholder="Enter task name"  [value]="task.taskName"/>
                <!-- <button class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#task-offcanvas" ></button> -->
                <div id="comment-btn" class="d-flex justify-content-center gap-3 text-muted align-items-center">
                    <!-- <p class="fa-regular fa-comment text-center text-muted p-0 m-0"></p> -->
                    <span id="tab" (click)="changeTab('activity')" >Activities</span>
                    <span id="tab" (click)="changeTab('comment')" class="d-flex align-items-center">Comments</span>
                </div>
            </div>
            <div class=" offcanvas-body overflow-scroll py-0 px-2">
                <div *ngIf="tab == 'activity' && !isLoading" class="container py-5">

                   <ul class="list-group list-unstyled text-muted p-3 gap-4">
                      <li class="list-item d-flex ">
                        <h6 class="h6 w-25 fs-6">Assign To</h6>
                        <div class="w-75">
                           <input type="text" id="input" class="form-control" placeholder="Assign Members"/>
                        </div>
                      </li>
                      <li class="list-item d-flex">
                        <h6 class="h6 w-25 fs-6">Date</h6>
                        <div class="w-75 d-flex gap-2">
                           <div class="w-25">
                                <small>Start Date</small>
                                <input type="date" class="form-control w-100" />
                           </div>
                            <div class="w-25">
                                <small>Due Date</small>
                                <input type="date" class="form-control w-100">
                            </div>
                        </div>
                      </li>
                      <li class="list-item d-flex">
                        <h6 class="h6 w-25 fs-6">Description</h6>
                        <div class="w-75">
                            <textarea id="input" class="form-control" cols="30" rows="5" placeholder="Enter description about task card "></textarea>
                        </div>
                      </li>
                   </ul>

                    <!-- activites -->
                    <div class="list-group d-flex flex-column list-unstyled text-muted p-2 gap-3 my-2">

                        <div *ngFor="let activity of activities;let idx = index;" class="w-100 position-relative ">
                            <div class="p-0 w-100  d-flex gap-1">
                                <input type="checkbox" [checked]="activity.status" name="" id="" />
                                <input (keydown)="handleAddActivity( $event , idx )" id="activity" [(ngModel)]="activity.activityName" class="text-muted" [class.is-invalid]="status.errorTargetIdx == idx && status.activityError" />
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
                        <button (click)="setUpAddActivity()" class="btn btn-sm btn-secondary"><i class="fa-solid fa-plus mx-1"></i>Add Activity</button>
                    </div>
                </div>

                <div *ngIf="tab == 'comment' && !isLoading " id="comments-container" style="max-height:800px !important;" class="container">
                    
                    <div id="comments">
                        <div id="comment-container" class="w-100 my-2 ">
                            <div id="comment-icon">
                                <h6 class="h6 mx-2" style="font-size:17px !important;">Ninja <small class="text-muted" style="font-size:13px;">Just Now</small></h6>
                                <!-- <p id="icon"></p> -->
                            </div>
                            <p id="comment">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum, error.
                            </p>
                        </div>                       
                    </div>

                    <div id="comment-send-box">
                        <form class="w-100 d-flex gap-1">
                            <input type="text" class="form-control w-75" placeholder="Comment Here" />
                            <button class="btn btn-sm w-25 btn-primary"><i class="fa-solid fa-paper-plane mx-1"></i>Send</button>
                        </form>
                    </div>

                </div>

                <div *ngIf="tab == 'activity-detail' && !isLoading " id="comments-container" style="max-height:800px !important;" class="container px-3">
                    
                    <div class="text-muted d-flex align-items-center my-4">
                        <span class="w-25">Activity Name</span>
                        <input type="text" class="form-control w-75 text-muted" [(ngModel)]="detailActivity.activityName" >
                    </div>

                    <div class="text-muted d-flex align-items-center my-4">
                        <span class="w-25">Date</span>
                        <div class="w-75 text-muted d-flex gap-2">
                            <div class="w-25">
                                <small>Start Date</small>
                                <input type="date" class="form-control w-100" />
                           </div>
                            <div class="w-25">
                                <small>Due Date</small>
                                <input type="date" class="form-control w-100">
                            </div>
                        </div>
                    </div>

                    <div class="text-muted d-flex align-items-center my-4">
                        <span class="w-25">Status</span>
                        <div class="w-75 text-muted d-flex justify-content-start  align-items-center ">
                            <div class="w-25 d-flex gap-2 m-0">
                                <label for="undone">Undone</label>
                                <input type="radio" name="status" id="undone" class="form-check">
                            </div>
                            <div class="w-25 d-flex gap-2 m-0">
                                <label for="done">Done</label>
                                <input type="radio" name="status" id="done" class="form-check" />
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
export class TaskOffCanvasComponent {
    
    @Input('task') task : TaskCard = new TaskCard();
    @Input('activities') activities : Activity [] = [];
    @Input('comments') comments : Comment [] = [];
    @Input('isLoading') isLoading : boolean = false;

    tab : string = 'activity';
    detailActivity : Activity = new Activity();

    status = {
        isAddActivity : false,
        activityError : '',
        msg : '',
        errorTargetIdx : 0,
    }

    constructor( private activityService : ActivityService ){}

    changeTab( tab : string ){
        this.tab = tab;
    }

    setUpAddActivity(){
        // to control clicking this button again & again
       if( !this.status.isAddActivity || this.activities.length == 0 ){
        this.status.isAddActivity = true;
        
        const newActivity = new Activity();

        this.activities.push( newActivity );
       }
    }

    handleAddActivity( e : KeyboardEvent , targetIdx : number ){
       this.status.activityError = '';
       let curActivityName =  this.activities[ targetIdx ].activityName;
       if( e.code === 'Enter' ){
          if( curActivityName  == '' || curActivityName == null ){           
            this.status.activityError = 'Acitiviy is required!';
            return;
          }

          /* 
           code to connect backend
          */
         const newActivity = this.activities[ targetIdx ];
         newActivity.taskCard = this.task;

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
       }
    }


    handleShowDetailActivity( activityId : number ){
        this.isLoading = true;
        this.detailActivity = this.activities.filter( activity => activity.id === activityId )[0];
        this.isLoading = false;

        this.tab = 'activity-detail';
    }

}