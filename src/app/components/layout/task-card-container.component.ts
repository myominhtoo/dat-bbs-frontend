import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Board } from 'src/app/model/bean/board';
import { Stage } from 'src/app/model/bean/stage';
import { TaskCard } from 'src/app/model/bean/taskCard';
import { StageService } from 'src/app/model/service/http/stage.service';
import { TaskCardService } from 'src/app/model/service/http/taskCard.service';
import { CdkDragDrop , moveItemInArray , transferArrayItem , CdkDragMove  } from '@angular/cdk/drag-drop';
import { ChangeStageType } from 'src/app/model/types/custom-types';
import swal from "sweetalert";
import { Attachment } from 'src/app/model/bean/attachment';
import $ from 'jquery';
import { SocketService } from 'src/app/model/service/http/socket.service';
import { Notification } from 'src/app/model/bean/notification';
import { UserStore } from 'src/app/model/service/store/user.store';

@Component({
  selector: 'task-card-container',
  template: `
    <div class="task-card-container mx-2 d-inline-block rounded-1">
      <!-- start task-card-header -->
      <div class="w-100 bg-transparent task-card-header p-2 pb-0">
        <div class="d-flex justify-content-between align-items-center p-2  rounded-sm bg-stage-dark">
          <!-- task-card-title -->
          <div class="text-justify">
            
            <h1 *ngIf="!status.isEditStage" class="stage-title text-white p-2 h5 mx-1 m-0 ">{{ data.stageName | titlecase }}</h1>
            <input *ngIf="status.isEditStage" [(ngModel)]="data.stageName" type="text" (keydown)="handleUpdateStage($event)"  class="form-control mx-2 text-capitalize rounded-0" style="box-shadow:none;" >
            <span *ngIf="status.stageError"  style="font-size:14px;" class="text-danger fw-bold mx-2">{{ status.stageError }}</span>
          </div>
          <!-- task-card-title -->
          <!-- task-card-icon -->
          <div class="d-flex justify-content-between align-items-center">
            <div class="stage-icon  flex-row-reverse">
            <div *ngIf="![1,2,3].includes(data.id)" class="dropdown">
              <i *ngIf="![1,2,3].includes(data.id) && !status.isEditStage" id="dropdown-btn" class="fas fa-solid fa-ellipsis text-white pe-1" data-bs-toggle="dropdown" aria-expanded="false"></i>
              <ul class="dropdown-menu">
                      <li (click)="handleSetUpStageEdit()" class="dropdown-item text-dark w-100">
                        Edit
                      </li>
                      <li (click)="deleteStage(data)" class="dropdown-item text-dark w-100">
                      Delete
                      </li>
                    </ul>
                  </div>
            <div class="me-2">
            <i *ngIf="!status.isEditStage" class="fas fa-solid fa-plus text-white" (click)="handleSetUpAddTask()"></i>
        </div>
            </div>
          </div>
          <!-- task-card-icon -->
        </div>
      </div>
      <!-- end task-card-header -->
      <!-- task-card start -->
      <!-- task-card-scroll -->
      <div class="container-fluid p-2 pt-0 m-0 ">
      <div class="my-2">
          <span class="text-danger fs-6">{{ status.addTaskError }}</span>
        </div>
        <div *ngIf="status.isAddTask" class="my-1">
          <input  [(ngModel)]="tempTask" name="tempTask" (keydown)="handleAddTask($event)"type="text" [class.is-invalid]="status.addTaskError" class="form-control shadow-none" placeholder="Enter Task" />
        </div>
        <div cdkDropList [cdkDropListData]="taskCards.get(data.stageName)" [id]="''+data.stageName+''" [cdkDropListConnectedTo]="relationContainers" class="w-100 py-2 d-flex flex-column" style="min-height:700px !important;">
            <task-card  cdkDrag (cdkDragMoved)="handleDragging($event)" (cdkDragDropped)="drop($event)" (show-task)="handleShowTaskOffcanvas($event)"  *ngFor="let task of taskCards.get(data.stageName)" [task]="task"></task-card>
        </div>
      </div>
    </div>
  `,
})
export class TaskCardContainerComponent {

  constructor( 
    private stageService : StageService ,
    private taskService : TaskCardService,
    private socketService : SocketService,
    private userStore : UserStore
    ){}

  @Input('stages') stages : Stage [] = [];
  @Input('stage') data : Stage = new Stage();
  @Input('task-cards') taskCards : Map<string,TaskCard[]> = new  Map();
  @Input('board') board = new Board();
  @Input('relations') relationContainers : string [] = [];
  @Input('attachments') attachments : Attachment [] = [];

  @Output('add-task') addTask = new EventEmitter<TaskCard>();
  @Output('change-stage') changeStage = new EventEmitter<ChangeStageType>();
  @Output('show-offcanvas') showTaskOffcanvas = new EventEmitter<TaskCard>();
  @Output('deleteStage') emitDeleteStage = new EventEmitter<Stage>();


  tempStage : string  = '';
  tempTask : string = '';


  status = {
    isEditStage : false,
    isEditing : false,
    stageError : '',
    isAddTask : false,
    isAddingTask : false,
    addTaskError : '',
  }

  handleSetUpStageEdit(){
     this.status.isEditStage = true;
     this.tempStage = this.data.stageName;
     $('#dropdown-btn').click();
  }

  handleUpdateStage( e : KeyboardEvent ){
    if( e.keyCode === 27 ){
      this.status.isEditStage = false;
      this.status.stageError = '';
      this.data.stageName = this.tempStage;
    }

    if( e.keyCode === 13 ){
      this.status.stageError = '';
      if( this.data.stageName == '' ){
        this.status.stageError = 'Stage Name Is Required!';
      }else{
        this.stageService.editStageName( this.data )
        .subscribe({
          next : res => {
            $('#dropdown-btn').click();
            if( res.ok ){

              const noti = new Notification();
              noti.content =  `${this.userStore.user.username.toLocaleUpperCase()}  Updated Stage in ${this.board.boardName} Board!`;
              noti.sentUser = this.userStore.user;
              noti.board = this.board;
              this.socketService.sentNotiToBoard( this.board.id , noti );

              this.status.isEditStage = false;
            }else{
              this.status.stageError = "Duplicate Stagename!"
            }
          },
          error : err => {
            console.log(err);
          }
        });
      }
    }
  }

  handleSetUpAddTask(){
    this.status.isAddTask = true;
  }

  handleAddTask( e : KeyboardEvent ){
    this.status.addTaskError = '';
    if( e.key === "Escape" ){
      this.status.isAddTask = false;
    }

    if( e.key === "Enter" ){
      const taskCard = new TaskCard();
      taskCard.taskName = this.tempTask.trim();// setting taskName from tempTask
      taskCard.stage = this.data;
      taskCard.board = this.board;
      taskCard.users = [];

      if(taskCard.taskName==''){
        this.status.addTaskError = "TaskCard Name cannot be null";
      }else{
        this.taskService.createTaskCard( taskCard )
        .subscribe({
          next : res => {
            this.tempTask = '';
            this.status.isAddTask = false;
            this.addTask.emit( res.data );
            const noti = new Notification();
            noti.sentUser = this.userStore.user;
            noti.content = `${this.userStore.user.username } Created Task Card \n In ${this.board.boardName} Board!`;
            noti.board = this.board;
            this.socketService.sentNotiToBoard( this.board.id , noti );
          },
          error : err => {
            this.status.addTaskError = err.error.message;
          }
        })
      }  
    }

  }

  drop( e : CdkDragDrop<TaskCard[]> ){
    if( e.previousContainer === e.container ){
      moveItemInArray( this.taskCards.get(this.data.stageName )! , e.previousIndex , e.currentIndex );
    }else{
      transferArrayItem( e.previousContainer.data , e.container.data , e.previousIndex , e.currentIndex );
      this.changeStage.emit({
        task : e.container.data[e.currentIndex],
        stageTo : e.container.id
      });
    }
  }

  handleDragging( e : CdkDragMove<any> ){
    const container = document.getElementById('main-area');
    let curPosition = e.pointerPosition.x;
    let realWidth = container?.clientWidth;


    if( realWidth! - curPosition < 500 ){
      container?.scrollTo({
        left : container.scrollLeft + 100,
        behavior : 'smooth'
      })
    }else{
      container?.scrollTo({
        left : container.scrollLeft - 200,
        behavior : 'smooth'
      })
    }
  }

  handleShowTaskOffcanvas( task : TaskCard ){
    this.showTaskOffcanvas.emit(task);
  }

  deleteStage(stage : Stage){ 
    
      swal({
            text : 'Are you sure ?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
          }).then( isYes => {
            if (isYes){
              // this.stageService.deleteStage(stage.id).subscribe(data=>{
              this.emitDeleteStage.emit(stage);
              // }) 
            }
    })
  }
}
