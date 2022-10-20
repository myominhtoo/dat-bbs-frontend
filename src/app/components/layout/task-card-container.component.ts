import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Board } from 'src/app/model/bean/board';
import { Stage } from 'src/app/model/bean/stage';
import { TaskCard } from 'src/app/model/bean/taskCard';
import { StageService } from 'src/app/model/service/http/stage.service';
import { TaskCardService } from 'src/app/model/service/http/taskCard.service';

@Component({
  selector: 'task-card-container',
  template: `
    <div class="task-card-container mx-2 d-inline-block rounded-1 ">
      <!-- start task-card-header -->
      <div class="w-100 bg-transparent task-card-header p-2 ">
        <div class="d-flex justify-content-between bg-snow p-2 rounded-sm">
          <!-- task-card-title -->
          <div class="text-justify">
            <h5 *ngIf="!status.isEditStage" class="stage-title h5 text-muted mx-1 m-0 fw-bold">{{ data.stageName | titlecase }}</h5>
            <input *ngIf="status.isEditStage" [(ngModel)]="data.stageName" type="text" (keydown)="handleUpdateStage($event)"  class="form-control mx-2">
            <span *ngIf="status.stageError"  style="font-size:14px;" class="text-danger mx-2">{{ status.stageError }}</span>
          </div>
          <!-- task-card-title -->
          <!-- task-card-icon -->
          <div class="d-flex justify-content-between align-items-center">
            <div class="stage-icon">
              <!-- <i class="fas fa-solid fa-plus"></i> -->
              <i *ngIf="data.id > 3 && !status.isEditStage" (click)="handleSetUpStageEdit()" class="fa-solid fa-pen text-muted mx-2"></i>
            </div>
            <div class="stage-icon">
              <i class="fas fa-solid fa-ellipsis text-muted"></i>
            </div>
          </div>
          <!-- task-card-icon -->
        </div>
      </div>
      <!-- end task-card-header -->
      <div class="container-fluid task-card-scroll ">
        <div class="w-100  d-flex flex-column">
            <task-card *ngFor="let task of taskCards.get(data.stageName)" [task]="task"></task-card>
        </div>
        <div class="my-2">
          <span class="text-danger fs-6">{{ status.addTaskError }}</span>
        </div>
        <div *ngIf="status.isAddTask" class="my-1">
          <input  [(ngModel)]="tempTask" name="tempTask" (keydown)="handleAddTask($event)"type="text" [class.is-invalid]="status.addTaskError" class="form-control" placeholder="Enter Task" />
        </div>
        <button (click)="handleSetUpAddTask()" class="w-100 btn btn-sm btn-secondary my-2"><i class="fa-solid fa-plus mx-1"></i>Add Task</button>
      </div>
    </div>
  `,
})
export class TaskCardContainerComponent{

  constructor( 
    private stageService : StageService ,
    private taskService : TaskCardService
    ){}

  @Input('stage') data : Stage = new Stage();
  @Input('task-cards') taskCards : Map<string,TaskCard[]> = new  Map();
  @Input('board') board = new Board();

  @Output('add-task') addTask = new EventEmitter<TaskCard>();

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
      taskCard.taskName = this.tempTask;// setting taskName from tempTask
      taskCard.stage = this.data;
      taskCard.board = this.board;

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

// <div
//             class="task-cards my-1  px-2 py-3"
//             data-bs-toggle="offcanvas"
//             data-bs-target="#offcanvasWithBothOptions"
//           >
//             <h5 class="h6 text-muted">Task Card</h5>

//             <div
//               class="offcanvas offcanvas-end"
//               data-bs-scroll="true"
//               tabindex="-1"
//               id="offcanvasWithBothOptions"
//             >
//               <div class="offcanvas-header">
//                 <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">
//                   Backdrop with scrolling
//                 </h5>
//                 <button
//                   type="button"
//                   class="btn-close"
//                   data-bs-dismiss="offcanvas"
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div class="offcanvas-body">
//                 <p>
//                   Try scrolling the rest of the page to see this option in
//                   action.
//                 </p>
//               </div>
//             </div>
//           </div> -->

