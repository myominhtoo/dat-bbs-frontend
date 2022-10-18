import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Board } from "src/app/model/bean/board";
import { Stage } from "src/app/model/bean/stage";
import { TaskCard } from "src/app/model/bean/taskCard";
import { BoardService } from "src/app/model/service/http/board.service";
import { StageService } from "src/app/model/service/http/stage.service";
import { BoardStore } from "src/app/model/service/store/board.store";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'my-board',
    templateUrl : './my-board.component.html'
})
export class MyBoardComponent implements OnInit {

    public stages : Stage [] = [];
    tasks : TaskCard [] = [];
    board : Board = new Board();
    stage : Stage = new Stage();

    status = {
        isLoading : false,
        isAddStage : false,
        isAddingStage : false,
        addingStageError : {
            hasError : false,
            msg : "",
        }
    }
    // @Input('data') data : Stage = new Stage();

    constructor( public toggleStore : ToggleStore ,
         public route : ActivatedRoute ,
         private router : Router , 
         private stageService : StageService ,
         private boardService : BoardService  ){}

    ngOnInit(): void {
        this.doActionForCurrentBoard( this.route.snapshot.params['id'] );
        this.stage.stageName = "";
        this.stage.defaultStatus = false;
    }

    /*
        getting stages for baord
    */
    async getStages( boardId : number ) : Promise<void>{
        this.stageService.getStagesForBoard( boardId )
        .subscribe({
            next : datas => {
                this.stages = datas;
            },
            error : err => {
                console.log(err);
                // window.history.back();
            }
        });
    }

    async getBoard( boardId : number ) : Promise<void> {
        this.boardService.getBoardWithBoardId( boardId )
        .subscribe({
            next : board => {
                this.status.isLoading = false;
                this.board = board;
            },
            error : err  => {
                // window.history.back();
            }
        })
    }

    doActionForCurrentBoard( boardId : any ){
      if( isNaN(boardId) ){
        /*
         will do if boardId is not a number 
         cuz we created boardId as a number
         to prevent manual entering to this page
        */
        window.history.back();
      }else{
        this.status.isLoading = true;
        this.getStages( boardId ).then(() => {
            this.getBoard( boardId );
        })
      }
    }

    toggleIsAddStage(){
        this.status.isAddStage = !this.status.isAddStage;
        this.status.addingStageError = { hasError : false , msg : '' };
    }

    handleAddStage(){
        this.stage.stageName === '' 
        ? this.status.addingStageError = { hasError : true , msg : 'Stage is Required!'}
        : this.status.addingStageError = { hasError : false , msg : ''};

        if( !this.status.addingStageError.hasError ){
            this.status.isAddingStage = true;
            
            this.stage.board  = this.board;

            this.stageService.createStage( this.stage )
            .subscribe({
                next : res => {
                    this.status.isAddingStage = false;
                   if( res.ok ){
                    this.stages.push( res.data );
                    this.status.isAddStage = false;
                    this.stage.stageName = "";
                   }else{
                    this.status.addingStageError = { hasError : true , msg : 'Duplicate Stage!'}
                   }
                    // window.scrollTo( scrollX + 100 , 0 );
                },
                error : err => {
                    console.log(err);
                }
            })
        }
    }

}