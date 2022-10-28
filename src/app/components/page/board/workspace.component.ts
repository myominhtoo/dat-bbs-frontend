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
    storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`)))); 
    boards : Board [] = [];
    ownerBoards:Board[]=[];
    assignBoards:Board[]=[];
    status = {
        isLoading : false
    }
    
    constructor( 
        public toggleStore : ToggleStore ,
        // private boardService : BoardService , 
        public boardStore : BoardStore  ){}

    ngOnInit(): void {
        setTimeout(() => {
                this.getBoards();
        } , 500  );
        document.title = "BBMS | My Workspace";
    }

    drop( e : CdkDragDrop<Board[]> ){
       
    }
    getBoards(){
        this.boards=this.boardStore.boards;

        this.ownerBoards= this.boards.filter((val)=>{
                return val.user.id==this.storeUser.id;
        })
        this.assignBoards=this.boards.filter((val)=>{
            return val.user.id!=this.storeUser.id;
    })

    this.assignBoards=this.boards.filter((val)=>{
        return val.user.id!=this.storeUser.id;
})
        
    }

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

