import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TaskCard } from "src/app/model/bean/taskCard";
import { User } from "src/app/model/bean/user";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from "src/app/model/service/store/user.store";
import { OnInit } from '@angular/core';
import { CdkDragDrop , moveItemInArray } from '@angular/cdk/drag-drop';
import swal from "sweetalert";
@Component({
    selector : 'my-tasks',
    templateUrl : './my-tasks.component.html',
})
export class MyTaskComponent implements OnInit{
    taskCards : TaskCard [] = [];
    //userId : string = "";
    status = {
        isLoading : false,
        hasDoneFetching : false,
    }
    pdf='pdf';
    excel='excel';
    html='html';
    constructor( public toggleStore : ToggleStore ,
        private taskCardService : TaskCardService ,
        public route : ActivatedRoute ,
        private userStore : UserStore
        ){
        document.title = "BBMS | My Tasks"; }

    ngOnInit(): void {
        this.getTasks(this.userStore.user.id);
    }
    drop( e : CdkDragDrop<TaskCard[]> ){
        if (e.previousContainer === e.container ){

        }
    }


        getTasks(userId : number){
            // console.log ("YouSee");
            this.status.isLoading = true;
            this.taskCardService.showMyTasks(userId).subscribe({
             next : data => {
                        
                    this.taskCards = data.filter((res=>{
                        return res.board.deleteStatus==false && res.deleteStatus==false;
                    }));
                    this.status.hasDoneFetching = true
                    this.status.isLoading = false;
             },
             error : err => {
                console.log(err);
             }
           });
        }

        exportAssignedTasksReport(path:string) {

            let useridd=this.userStore.user.id;
    
              this.taskCardService.exportAssignedTasksReport(useridd,path).subscribe((data)=>{
                  swal({
                      text : 'Successfully Exported!',
                      icon : 'success'
                  });
              })
      
            }
}

