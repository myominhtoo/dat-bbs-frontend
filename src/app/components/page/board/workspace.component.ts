import { Component, OnInit } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { BoardService } from "src/app/model/service/http/board.service";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { UserService } from "src/app/model/service/http/user.service";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'workspace',
    templateUrl : './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {

    boards : Board [] = [];

    status = {
        isLoading : false
    }
    
    constructor( 
        public toggleStore : ToggleStore ,
        private boardService : BoardService ){}

    ngOnInit(): void {
        this.getMyBoards();// getting boards for target logged in user
    }


    // func to get boards 
    getMyBoards(){
        this.status.isLoading = true;
        /*
          param is to input user Id 
        */
        this.boardService.getBoardsForUser( 1 )
        .subscribe({
            next : datas => {
                this.status.isLoading = false;
                console.log(datas);
                this.boards = datas;
            },
            error : err => {
                console.log(err.error.message);
            }
        });
    }

}