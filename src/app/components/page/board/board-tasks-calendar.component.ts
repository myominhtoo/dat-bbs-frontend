import { Component , OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/angular';
import { BoardTasksStore } from 'src/app/model/service/store/board-tasks.store';
import { BoardService } from 'src/app/model/service/http/board.service';
import { TaskCardService } from 'src/app/model/service/http/taskCard.service';

 
@Component({
    selector : 'board-tasks-calendar',
    template : `
        <div class="px-2 pe-5 w-100 m-4 border-board d-flex justify-content-between align-items-center">
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
        initialView : 'listWeek',
        headerToolbar: {
            right : 'prev,next',
            center: 'title',
            left : ''
        },
        selectable : true,
        weekends : true,
        events : [
            { title : 'To sleep'  , start : '2022-11-01  12:00:00' , end : '2022-11-20 12:00:00' ,  },
            // { title : 'To eat'  , start : '2022-11-05' , end : '2022-11-20' }
        ]
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
                         return { title : filteredTaskCard.taskName , start : `${filteredTaskCard.startedDate} 12:00:00` , end : `${filteredTaskCard.endedDate} 12:00:00`  }
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

}