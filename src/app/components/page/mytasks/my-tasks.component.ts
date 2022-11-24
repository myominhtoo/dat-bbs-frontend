import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TaskCard } from "src/app/model/bean/taskCard";
import { User } from "src/app/model/bean/user";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from "src/app/model/service/store/user.store";
import { OnInit } from '@angular/core';
import { CdkDragDrop , moveItemInArray } from '@angular/cdk/drag-drop';
import swal from "sweetalert";
import { BoardTasksStore } from "src/app/model/service/store/board-tasks.store";
import { CalendarOptions, FullCalendarComponent } from "@fullcalendar/angular";

@Component({
    selector : 'my-tasks',
    templateUrl : './my-tasks.component.html',
})
export class MyTaskComponent implements OnInit{

    @ViewChild('calendar') MytasksCalendar : FullCalendarComponent | undefined ;
    taskCards : TaskCard [] = [];
    isLoading : boolean = false;
    curView : string = 'calendar';
    //userId : string = "";
    status = {
        isLoading : false,
        hasDoneFetching : false,
        isReporting : false,
    }
    pdf='pdf';
    excel='excel';
    html='html';

    calendarDetails : CalendarOptions = {
        initialView : 'dayGridMonth',
        headerToolbar: {
            right : 'prev,next',
            center: 'title',
            left : ''
        },
        selectable : true,
        weekends : true,
        events : [],

    }

    constructor( public toggleStore : ToggleStore ,
        private taskCardService : TaskCardService ,
        public route : ActivatedRoute ,
        public userStore : UserStore,
        private boardTasksStore : BoardTasksStore
        ){
        document.title = "BBMS | My Tasks"; }

    ngOnInit(): void {
        const userId = this.route.snapshot.params["id"];
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
            const details = this.taskCards.map(taskcard=>{
                return {title : taskcard.taskName,start:`${taskcard.startedDate}`,end : `${taskcard.endedDate}`}
            })
                                       
                    this.calendarDetails.events = details;
                    this.status.hasDoneFetching = true;
                    this.status.isLoading = false;
                  
             },
             error : err => {
                console.log(err);
             }
           });
        }

        exportAssignedTasksReport(path:string) {
            this.status.isReporting=true;
            let useridd=this.userStore.user.id;
    
              this.taskCardService.exportAssignedTasksReport(useridd,path).subscribe((res)=>{
                this.status.isReporting=false;
                const blob = new Blob([res.body], { type : 'application/octet-stream'});
                const a = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                a.href = objectUrl;
                a.download = `assigned-tasks.${path=='excel' ? 'xlsx' : path.toLowerCase()}`,
                a.click();
                URL.revokeObjectURL(objectUrl);
                  swal({
                      text : 'Successfully Exported!',
                      icon : 'success'
                  });
              })
      
            }


}

