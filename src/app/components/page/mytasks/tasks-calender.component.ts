import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CalendarOptions, FullCalendarComponent } from "@fullcalendar/angular";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { UserService } from "src/app/model/service/http/user.service";
import { BoardTasksStore } from "src/app/model/service/store/board-tasks.store";


@Component({
    selector : 'mytasks-calender',
    template : `
       <!-- <h1>Yousee</h1>
        <div class="modal fade" data-bs-backdrop="static"  id="#tasks-calender-modal">
            <div class="modal-dialog modal-dialog-centered ">
                <div class="modal-content p-3">
                <header class="modal-header d-flex justify-content-between">
                    <h4 class="text-muted">Calender</h4>
                    <i class="btn-close" id="close-attachment-btn" data-bs-dismiss='modal' data-bs-target="#tasks-calender-modal"></i>
                </header>
                </div>
            </div>
        </div> -->
    `
})

export class TasksCalenderComponent implements OnInit{
    ngOnInit(): void {
       
    }

    // isLoading : boolean = false;
    // curView : string = 'calendar';

   // @ViewChild('calendar') calendar : FullCalendarComponent | undefined ;

    // calendarDetails : CalendarOptions = {
    //     initialView : 'dayGridMonth',
    //     headerToolbar: {
    //         right : 'prev,next',
    //         center: 'title',
    //         left : ''
    //     },
    //     selectable : true,
    //     weekends : true,
    //     events : [],

   // }
    
    // constructor(
    //     private location : Location ,
    //     private route : ActivatedRoute,
    //     private taskCardService : TaskCardService,
    //     private userService : UserService,
    //     private boardTasksStore : BoardTasksStore ){}



    // getTasks(userId : number){
    //     this.taskCardService.showMyTasks(userId).subscribe({
    //         next : res=> {
    //             this.boardTasksStore.taskCards = res;
    //         },
    //         error : err => {
    //             console.log(err);
    //         }
    //    });
    // }
}