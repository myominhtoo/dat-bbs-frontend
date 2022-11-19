import { Component , OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/angular';
import { BoardTasksStore } from 'src/app/model/service/store/board-tasks.store';
import { BoardService } from 'src/app/model/service/http/board.service';
import { TaskCardService } from 'src/app/model/service/http/taskCard.service';
import swal from 'sweetalert';
import { TaskCard } from 'src/app/model/bean/taskCard';
import { Stage } from 'src/app/model/bean/stage';
 
@Component({
    selector : 'board-tasks-calendar',
    template : `
        <div class="px-5 pe-5 w-100 m-4 border-board d-flex justify-content-between align-items-center">
           <div>
                <h2>{{ boardTasksStore.board.boardName }} Board' Tasks Calendar</h2>
           </div>
           <div>
                <button (click)="backToBoard()" class="btn btn-sm btn-outline-secondary py-1 myboard-btn">
                    <i class="fa-solid fa-square-caret-left"></i>
                    Back To Board
                </button>
           </div>
        </div>
        <div id="full-calendar-container" class="d-flex justify-content-center align-items-center">
            <full-calendar [options]="calendarDetails" ></full-calendar>
        </div>
    `
})
export class BoardTasksCalendarComponent implements OnInit {

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
        select : this.handleSelectCalendar.bind(this)
    }

    constructor(
        public boardTasksStore : BoardTasksStore ,
        private location : Location ,
        private route : ActivatedRoute,
        private boardService : BoardService,
        private taskCardService : TaskCardService ){}
    
    ngOnInit() : void { 
        const boardId = this.route.snapshot.params["id"];
        if( this.boardTasksStore.hasGotData  ){
            this.getEventsFromData();
        }else{
            this.getRequiredData( boardId );
        }
    }

    backToBoard(){
        this.location.back();
    }

    private getEventsFromData(){
        const events = this.boardTasksStore.taskCards
                       .filter( taskCard => taskCard.stage.id != 3 ) //filtering not to include task from done stage
                       .map( filteredTaskCard => {
                         return { title : filteredTaskCard.taskName , start : `${filteredTaskCard.startedDate}` , end : `${filteredTaskCard.endedDate}`  }
                       });
        this.calendarDetails.events = events;
    }

    private getRequiredData( boardId : number ){
        this.getBoard( boardId );
        this.getTaskCards( boardId );
        setTimeout(() => {
            this.getEventsFromData();
        } , 500 );
    }

    private getBoard( boardId : number ){
        this.boardService.getBoardWithBoardId(  boardId )
        .subscribe({
            next : resBoard => {
                this.boardTasksStore.board = resBoard;
            },
            error : err => {
                console.log(err);
            }
        });
    }

    private getTaskCards( boardId : number ){
        this.taskCardService.getTaskCards( boardId )
        .subscribe({
            next : resTaskCards => {
                this.boardTasksStore.taskCards = resTaskCards;
            },
            error : err => {
                console.log(err);
            }
        });
    }

    private handleSelectCalendar( selectInfo : DateSelectArg ){
       const currentDateInMilliSecond = new Date().getTime();
       const taskStartDateInMilliSecond = selectInfo.start.getTime();
       const taskEndDateInMilliSeconde = selectInfo.end.getTime();

       // not allow to start task from prev date from now or end date that is front of start date
      if(  ( currentDateInMilliSecond - taskStartDateInMilliSecond >  86400000)  || taskEndDateInMilliSeconde < taskStartDateInMilliSecond ){
        swal({
            text : 'Invalid start date or end date!',
            icon : 'warning'
        });
      }else{
            swal( 'Enter task name ' , {
                content : {
                    element : 'input'
                }
            }).then( taskName => {
                const newTask = new TaskCard();
                newTask.taskName = taskName;
                newTask.startedDate = selectInfo.startStr as any as Date;
                newTask.endedDate = selectInfo.endStr as any as Date;
                const stage = new Stage();
                stage.id = 1;
                newTask.stage = stage;
                newTask.board = this.boardTasksStore.board;


                this.taskCardService.createTaskCard( newTask )
                .subscribe({ 
                    next : resStatus => {
                        if(resStatus.ok){
                            swal({
                                text : resStatus.message,
                                icon : 'success',
                            }).then( () => {
                                this.boardTasksStore.taskCards.push( newTask );
                                this.calendarDetails.events = this.boardTasksStore.taskCards
                                                              .map( task => {
                                                                return { title : task.taskName , start : `${task.startedDate}` , end : `${task.endedDate}`}
                                                              })
                            })
                        }else{
                            swal({
                                text : resStatus.message,
                                icon : 'warning',
                            })
                        }
                    },
                    error : err => {
                        swal({
                            text : err.error.message,
                            icon : 'warning'
                        })
                    }
                })
            });
        }

    }

}