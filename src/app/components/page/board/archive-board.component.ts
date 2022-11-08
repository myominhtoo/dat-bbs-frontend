import { Component, OnInit } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { User } from "src/app/model/bean/user";
import { BoardService } from "src/app/model/service/http/board.service";
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserStore } from "src/app/model/service/store/user.store";
import { BoardStore } from "src/app/model/service/store/board.store";

@Component({
    selector :'archive-board',
    templateUrl : './archive-board.component.html'
})
export class ArchiveBoardComponent implements OnInit {

    user : User = new User();
    boards : Board[] = [];


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
    
}

