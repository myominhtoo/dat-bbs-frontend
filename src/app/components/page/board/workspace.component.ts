import { Component, Input, OnInit } from "@angular/core";
import { BoardStore } from "src/app/model/service/store/board.store";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { CdkDragDrop , moveItemInArray } from '@angular/cdk/drag-drop';
import { Board } from "src/app/model/bean/board";
import swal from 'sweetalert';
import { BoardService } from "src/app/model/service/http/board.service";

@Component({
    selector : 'workspace',
    templateUrl : './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {

  storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`))));
  // @Input('data') data : Board = new Board();
           boarding : Board=new Board();

   boards : Board [] = [];
    ownerBoards:Board[]=[];
    assignBoards:Board[]=[];
    status = {
        isLoading : false,
        hasDoneFetching : false,
    }

    constructor(
        public toggleStore : ToggleStore ,
       private boardService : BoardService ,
        public boardStore : BoardStore  ){}

    ngOnInit(): void {
        setTimeout(() => {
                this.getBoards();
        } , 100  );
        document.title = "BBMS | My Workspace";
    }

    drop( e : CdkDragDrop<Board[]> ){

    }

     removeBoard(board : Board){

        // this.boardService.updateBoard(this.data).subscribe(datas=>{
         this.ownerBoards=this.ownerBoards.filter(boarding=> boarding.id!=board.id)
        // })

 }


    getBoards(){

        this.boards=this.boardStore.boards;

        this.ownerBoards= this.boards.filter((val)=>{
                return val.user.id==this.storeUser.id;
        })
        this.assignBoards=this.boards.filter((val)=>{
            return val.user.id!=this.storeUser.id;
        })
        this.status.hasDoneFetching = true;

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

