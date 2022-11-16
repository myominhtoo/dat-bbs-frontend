import { Component, OnInit } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { User } from "src/app/model/bean/user";
import { BoardService } from "src/app/model/service/http/board.service";
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserStore } from "src/app/model/service/store/user.store";
import { BoardStore } from "src/app/model/service/store/board.store";
// import * as swal from "sweetalert";
import swal from "sweetalert";



@Component({
    selector :'archive-board',
    templateUrl : './archive-board.component.html'
})
export class ArchiveBoardComponent implements OnInit {

    user : User = new User();
    boards : Board[] = [];

    pdf='pdf';
    excel='excel';
    html='html';


    ngOnInit(): void {
        this.showDeletedBoardsByUserId(this.userStore.user.id );

    }

    constructor( private boardService : BoardService , public userStore : UserStore , private boardStore : BoardStore ){}

    drop( e : CdkDragDrop<Board[]> ){}


    showDeletedBoardsByUserId( userId : number ){
       // console.log(userId);
        this.boardService.getDeletedBoardWithBoardId(userId).subscribe({
            next : data => {
                this.boards= data;
            },
            error : err => {
                console.log(err);
            }
        });
    }

    restoreBoard(board : Board){
        this.boards=this.boards.filter(resBoard=>resBoard.id!=board.id)
        board.deleteStatus = false;
        this.boardStore.ownBoards.push( board );
    }

    exportArchiveBoardReport(path:string) {

      let id=this.userStore.user.id;
      console.log(id);
        this.boardService.exportArchiveBoardReport(id,path).subscribe((data)=>{

          swal({
            text : 'Successfully Exported!',
            icon : 'success'
        });


        })

      }


}

