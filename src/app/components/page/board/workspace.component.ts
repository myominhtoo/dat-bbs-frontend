import { Component, OnInit } from "@angular/core";
import { BoardStore } from "src/app/model/service/store/board.store";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { CdkDragDrop , moveItemInArray } from '@angular/cdk/drag-drop';
import { Board } from "src/app/model/bean/board";

@Component({
    selector : 'workspace',
    templateUrl : './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {

    // boards : Board [] = [];

    status = {
        isLoading : false
    }
    
    constructor( 
        public toggleStore : ToggleStore ,
        // private boardService : BoardService , 
        public boardStore : BoardStore  ){}

    ngOnInit(): void {
        // this.getMyBoards();// getting boards for target logged in user
    }

    drop( e : CdkDragDrop<Board[]> ){
        console.log(e);
        // moveItemInArray( this.boardStore.boards , e.previousIndex , e.currentIndex );
    }



    // func to get boards 
    // getMyBoards(){
    //     this.status.isLoading = true;
    //     /*
    //       param is to input user Id 
    //     */
    //     this.boardService.getBoardsForUser( 1 )
    //     .subscribe({
    //         next : datas => {
    //             this.status.isLoading = false;
    //             this.boards = datas;
    //         },
    //         error : err => {
    //             console.log(err.error.message);
    //         }
    //     });
    // }

}