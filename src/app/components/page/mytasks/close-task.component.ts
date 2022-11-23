import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TaskCard } from "src/app/model/bean/taskCard";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { CdkDragDrop , moveItemInArray } from '@angular/cdk/drag-drop';
import swal from "sweetalert";
import { Stage } from "src/app/model/bean/stage";




@Component({
  selector:'CloseTaskComponent',
  templateUrl : 'close-task.component.html'
})

export class CloseTaskComponent{

  @Input('task') task : TaskCard = new TaskCard();
  @Input('stage') data : Stage = new Stage();
  @Input('task-cards') taskCardMap : Map<string,TaskCard[]> = new  Map();
  taskCards : TaskCard [] = [];
  pdf='pdf';
  excel='excel';
  html='html';
status = {
        isLoading : false,
        hasDoneFetching : false,
    }
  path:string="";

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
        //  console.log ("YouSee");
        let idd=this.route.snapshot.params['id'];
// console.log(idd);
      this.status.isLoading=true
        this.taskCardService.showDeleteTaskCard(idd).subscribe({
         next : data => {
            this.taskCards = data;
            this.status.isLoading = true
            this.status.hasDoneFetching=true
         },
         error : err => {
            console.log(err);
         }
       });
    }


    restoreTask(task : TaskCard){
      let tasksMap= this.taskCardMap.get(this.data.stageName);
      tasksMap?.push(task);
       this.taskCards=this.taskCards.filter(tsk => tsk.id != task.id);
       this.task.deleteStatus=false;
       this.taskCardMap.set ( this.data.stageName, tasksMap!);
     }

     exportArchiveTaskReport(path:string ) {

      let boardId = this.route.snapshot.params['id'];

      // console.log("aaaaaaaaaaaaaaa");

      this.taskCardService.exportArchiveTaskReport(boardId,path).subscribe((res)=>{
        const blob = new Blob([res.body], { type : 'application/octet-stream'});
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `archive-tasks.${path=='excel' ? 'xlsx' : path.toLowerCase()}`,
        a.click();
        URL.revokeObjectURL(objectUrl);
          swal({
              text : 'Successfully Exported!',
              icon : 'success'
          });
      })

    }

}
