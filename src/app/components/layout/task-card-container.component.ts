import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Board } from 'src/app/model/bean/board';
import { Stage } from 'src/app/model/bean/stage';
import { TaskCard } from 'src/app/model/bean/taskCard';
import { StageService } from 'src/app/model/service/http/stage.service';
import { TaskCardService } from 'src/app/model/service/http/taskCard.service';
import { CdkDragDrop , moveItemInArray , transferArrayItem , CdkDragMove  } from '@angular/cdk/drag-drop';
import { ChangeStageType } from 'src/app/model/types/custom-types';
import swal from "sweetalert";
@Component({
  selector: 'task-card-container',
  template: `
    <div class="task-card-container mx-2 d-inline-block rounded-1">
      <!-- start task-card-header -->
      <div class="w-100 bg-transparent task-card-header p-2 pb-0">
        <div class="d-flex justify-content-between align-items-center p-2 rounded-sm bg-stage-dark pb-3">
          <!-- task-card-title -->
          <div class="text-justify">
            
            <h1 *ngIf="!status.isEditStage" class="stage-title text-white pt-1 h5 mx-1 m-0 ">{{ data.stageName | titlecase }}</h1>
            <input *ngIf="status.isEditStage" [(ngModel)]="data.stageName" type="text" (keydown)="handleUpdateStage($event)"  class="form-control mx-2 text-capitalize" style="box-shadow:none;" >
            <span *ngIf="status.stageError"  style="font-size:14px;" class="text-danger mx-2">{{ status.stageError }}</span>
          </div>
          <!-- task-card-title -->
          <!-- task-card-icon -->
          <div class="d-flex justify-content-between align-items-center px-3">
            <div class="stage-icon align-items-center">
              <i *ngIf="![1,2,3].includes(data.id) && !status.isEditStage" (click)="handleSetUpStageEdit()" class="fa-solid fa-pencil text-white"></i>
              <i *ngIf="![1,2,3].includes(data.id)"  (click)="deleteStage(data)" class="fas fa-solid fa-trash text-white mx-2"></i>
            </div>
          </div>
          <!-- task-card-icon -->
        </div>
      </div>
      <!-- end task-card-header -->
      <!-- task-card start -->
      <!-- task-card-scroll -->
      <div class="container-fluid p-2 pt-0 m-0">
        <div cdkDropList [cdkDropListData]="taskCards.get(data.stageName)" [id]="''+data.stageName+''" [cdkDropListConnectedTo]="relationContainers" class="w-100 py-2 d-flex flex-column">
            <task-card  cdkDrag (cdkDragMoved)="handleDragging($event)" (cdkDragDropped)="drop($event)" (show-task)="handleShowTaskOffcanvas($event)"  *ngFor="let task of taskCards.get(data.stageName)" [task]="task"></task-card>
        </div>
        <div class="my-2">
          <span class="text-danger fs-6">{{ status.addTaskError }}</span>
        </div>
        <div *ngIf="status.isAddTask" class="my-1">
          <input  [(ngModel)]="tempTask" name="tempTask" (keydown)="handleAddTask($event)"type="text" [class.is-invalid]="status.addTaskError" class="form-control shadow-none" placeholder="Enter Task" />
        </div>
        <button (click)="handleSetUpAddTask()" class="w-100 btn btn-sm h1 my-2"><i class="fa-solid fa-plus mx-1"></i>Add Task</button>
      </div>
    </div>
  `,
})
export class TaskCardContainerComponent implements OnInit {

  constructor( 
    private stageService : StageService ,
    private taskService : TaskCardService
    ){}

  @Input('stages') stages : Stage [] = [];
  @Input('stage') data : Stage = new Stage();
  @Input('task-cards') taskCards : Map<string,TaskCard[]> = new  Map();
  @Input('board') board = new Board();
  @Input('relations') relationContainers : string [] = [];

  @Output('add-task') addTask = new EventEmitter<TaskCard>();
  @Output('change-stage') changeStage = new EventEmitter<ChangeStageType>();
  @Output('show-offcanvas') showTaskOffcanvas = new EventEmitter<TaskCard>();
  @Output('deleteStage') emitDeleteStage = new EventEmitter<Stage>();


  tempStage : string  = '';
  tempTask : string = '';

  // containers : string [] = [];


  status = {
    isEditStage : false,
    isEditing : false,
    stageError : '',
    isAddTask : false,
    isAddingTask : false,
    addTaskError : '',
  }

  ngOnInit(): void {
    // this.handleJoinContainers();
  }


  // handleJoinContainers(){
  //   this.containers = this.stages.filter( stage => {
  //     return stage.id != this.data.id;
  //   }).map( filterStage => {
  //     return `${filterStage.id}`;
  //   })
  // }

  handleSetUpStageEdit(){
     this.status.isEditStage = true;
     this.tempStage = this.data.stageName;
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
            if( res.ok ){
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

      if(taskCard.taskName==''){
        this.status.addTaskError = "TaskCard Name cannot be null";
      }else{
        this.taskService.createTaskCard( taskCard )
      .subscribe({
        next : res => {
          this.tempTask = '';
          this.status.isAddTask = false;
          this.addTask.emit( res.data );
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
    const container = document.getElementById('task-container');
    let curPosition = e.pointerPosition.x;
    let realWidth = container?.clientWidth;

    if( curPosition - realWidth! < 8000 ){
      // console.log( curPosition , realWidth! )

      container?.scrollTo({
        left : container.scrollLeft + curPosition - realWidth! + 100,
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
