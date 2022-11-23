import { Component, OnInit } from "@angular/core";
import { BoardService } from "src/app/model/service/http/board.service";
import { StageService } from "src/app/model/service/http/stage.service";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import Chart  from 'chart.js/auto';
import { BoardTasksStore } from "src/app/model/service/store/board-tasks.store";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { forkJoin, tap } from "rxjs";

@Component({
    selector : 'board-tasks-chart',
    template : `
            <div class=" container">
                <div class=" px-5 w-100 py-2 mt-2 border-board d-flex justify-content-between align-items-center">
                    <h3>Stages - TaskCards' Chart</h3>
                    <div>
                        <button (click)="backToBoard()" class="btn btn-sm btn-outline-secondary py-1 myboard-btn">
                            <i class="fa-solid fa-square-caret-left"></i>
                            Back To Board
                        </button>
                    </div>
                </div>
                <loading [show]="status.isLoading" target="Chart..." ></loading>          
                <div class="w-75 mx-auto" style="heigth:600px !important;" >
                    <canvas id="chart"></canvas>
                </div>
            </div>
               `
})
export class StageTasksChartComponent implements OnInit {
     
  
    status = {
        isLoading : false
    }

    constructor(
        private stageService : StageService,
        private taskCardService : TaskCardService,
        public boardTasksStore : BoardTasksStore,
        private route : ActivatedRoute , 
        private location : Location,
    ){}
    

    ngOnInit(): void {
        const boardId = this.route.snapshot.params["id"];
        if(this.boardTasksStore.hasGotData){
            this.getTasksChart();
        }else{
            this.getData( boardId );
        }
    }


    private getTasksChart (){

        const ctx = document.getElementById('chart') as HTMLCanvasElement;
        const stages = this.boardTasksStore.stages;
        const tasks = this.boardTasksStore.taskCards;
        const data = stages.map(stage=>{
                        return  tasks.filter(task=> task.stage.id == stage.id).length;
                    })
        data.push(Math.max(...data)+3);
        const chart =new Chart (ctx, {
            type: 'bar',
            data: {
                labels : stages.map( stage=> stage.stageName.toUpperCase() ),
                datasets: [{
                    label: 'TaskCards',
                    data : data,
                    backgroundColor : ['#50577A'],
                    borderColor: ['#50577A'],
                }]
            },
            
          });
    }

    private getData(boardId : number){
       this.status.isLoading = true;
       forkJoin([
        this.stageService.getStagesForBoard( boardId ).pipe(tap( res => res )),
        this.taskCardService.getTaskCards( boardId ).pipe(tap( res => res ))
       ]).subscribe({
        next :  allResults => {
            this.boardTasksStore.stages = allResults[0];
            this.boardTasksStore.taskCards = allResults[1];
            this.status.isLoading = false;
            this.getTasksChart();
         },
         error : err => {
            this.status.isLoading = false;
         }
       });
    }

    backToBoard(){
        this.location.back();
    }
   

}