import { Component, OnInit } from "@angular/core";
import { BoardService } from "src/app/model/service/http/board.service";
import { StageService } from "src/app/model/service/http/stage.service";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import Chart  from 'chart.js/auto';
import { BoardTasksStore } from "src/app/model/service/store/board-tasks.store";
import { ActivatedRoute } from "@angular/router";
import { Stage } from "src/app/model/bean/stage";
import { count } from "rxjs";

@Component({
    selector : 'board-tasks-chart',
    template : `
            <div class=" container">
                <div class=" px-5 pe-5 w-100 m-4 border-board d-flex justify-content-between align-items-center">
                    <h2>Stages-TaskCards' Chart</h2>
                </div>
                <div class="" >
                    <canvas width="800px" height="300px" id="chart"></canvas>
                    
                </div>
            </div>

               `

})
export class StageTasksChartComponent implements OnInit {
     
   // stages : Stage []=[];

    constructor(
        private boardService : BoardService,
        private stageService : StageService,
        private taskCardService : TaskCardService,
        public boardTasksStore : BoardTasksStore,
        private route : ActivatedRoute
        
        ){}
    
    ngOnInit(): void {
        const boardId = this.route.snapshot.params["id"];
        this.getdata(boardId);
        setTimeout(()=>{ 
           this.getTasksChart(boardId)},1000 );
    }


    private getTasksChart (boardId : number){

        const ctx = document.getElementById('chart') as HTMLCanvasElement;
        const stages = this.boardTasksStore.stages;
        const tasks = this.boardTasksStore.taskCards;
        console.log(stages);
        console.log(tasks);
        const data = stages.map(stage=>{
                  return  tasks.filter(task=> task.stage.id == stage.id).length;
                 })
        data.push(Math.max(...data)+3);
        // console.log(...data);
        const chart =new Chart (ctx, {
            type: 'bar',
            data: {
                labels : stages.map(stage=> stage.stageName),
                datasets: [{
                    label: 'TaskCards',
                    data : data,
                    // backgroundColor: ['rgb(0, 13, 65 )','rgb(2, 84, 44  )','rgb(191, 6, 104 )','rgb(255, 233, 48 )'],
                    backgroundColor : ['#25316D','#5F6F94','#97D2EC'],
                    borderColor: [],
                    borderWidth: 1

                }]
            },
            
          });
        
         

          chart.draw();
    }

    getStages(boardId :number ){
        this.stageService.getStagesForBoard(boardId).subscribe({
            next : (res) => {
                this.boardTasksStore.stages=res;
            },
            error : err => {
                console.log(err);
            }
        })
    }

    getTasks(boardId : number){
        this.taskCardService.getTaskCards(boardId).subscribe({
            next: (res) =>{
                this.boardTasksStore.taskCards=res;
              
              
            }, 
            error : err => {
                console.log(err);
            }
        })
    }

    private getdata(boardId : number){
        this.getStages(boardId);
        this.getTasks(boardId);
    }


   

}