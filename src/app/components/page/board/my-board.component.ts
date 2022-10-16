import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Stage } from "src/app/model/bean/stage";
import { TaskCard } from "src/app/model/bean/taskCard";
import { StageService } from "src/app/model/service/http/stage.service";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'my-board',
    templateUrl : './my-board.component.html'
})
export class MyBoardComponent implements OnInit {

    stages : Stage [] = [];
    tasks : TaskCard [] = [];
    status = {
        isLoading : false,
    }

    constructor( public toggleStore : ToggleStore ,
         public route : ActivatedRoute ,
         private router : Router , 
         private stageService : StageService  ){}

    ngOnInit(): void {
        this.doActionForCurrentBoard( this.route.snapshot.params['id'] );
    }

    /*
        getting stages for baord
    */
    getStages( boardId : number ){
        this.status.isLoading = true;
        this.stageService.getStagesForBoard( boardId )
        .subscribe({
            next : datas => {
                this.status.isLoading = false;
                this.stages = datas;
            },
            error : err => {
                console.log(err);
                window.history.back();
            }
        });
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
        this.getStages( boardId );
      }
    }

}