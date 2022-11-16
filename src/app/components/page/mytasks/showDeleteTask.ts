import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TaskCard } from "src/app/model/bean/taskCard";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { CdkDragDrop , moveItemInArray } from '@angular/cdk/drag-drop';
import * as swal from "sweetalert";
import { Stage } from "src/app/model/bean/stage";



@Component({
  selector:'showDeleteTask',
  templateUrl : 'showDeleteTask.html'
})

export class ShowDeleteTaskComponent{

  @Input('task') task : TaskCard = new TaskCard();

  @Input('stage') data : Stage = new Stage();


  @Input('task-cards') taskCardMap : Map<string,TaskCard[]> = new  Map();

  taskCards : TaskCard [] = [];


  constructor( public toggleStore : ToggleStore ,
    private taskCardService : TaskCardService ,
    public route : ActivatedRoute ,

    ){
    document.title = "BBMS | My Tasks"; }

ngOnInit(): void {
  let id=this.route.snapshot.params['id'];
  console.log(id);
    this.getTasks(id);
}

drop( e : CdkDragDrop<TaskCard[]> ){
    if (e.previousContainer === e.container ){

    }
}



    getTasks(id : number){
         console.log ("YouSee");
        let idd=this.route.snapshot.params['id'];
console.log(idd);

        this.taskCardService.showDeleteTaskCard(idd).subscribe({
         next : data => {
            this.taskCards = data;
         },
         error : err => {
            console.log(err);
         }
       });
    }


    restoreTask(task : TaskCard){
      let tasksMap= this.taskCardMap.get(this.data.stageName);
       this.taskCardMap.set( this.data.stageName , tasksMap?.filter( taskMap => taskMap.id != task.id )!);
     }


  //    restoreTask(e : Event){
  //    e.stopPropagation();
  //     swal({
  //          text: 'Are you sure to restore TaskCard?',
  //         icon: 'warning',
  //         buttons: ['No','Yes']
  //     }).then(isYes=>{
  //         this.task.deleteStatus=false;
  //         this.taskCardService.updateTaskCard(this.task).subscribe({
  //             next:res=>{
  //                 this.emitRestoreTask.emit(this.task);
  //                 this.task.deleteStatus=false;
  //             },
  //             error : err =>{
  //                 console.log(err);
  //             }
  //         })
  //     })
  // }

}
