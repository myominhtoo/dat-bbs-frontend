import { BoardBookMark } from './../../../model/bean/BoardBookMark';
import { UserService } from 'src/app/model/service/http/user.service';
import { Component, Input, OnInit } from "@angular/core";
import { BoardStore } from "src/app/model/service/store/board.store";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Board } from "src/app/model/bean/board";
import { ActivatedRoute, Router } from "@angular/router";
import { UserStore } from 'src/app/model/service/store/user.store';
import { BoardService } from 'src/app/model/service/http/board.service';
import swal from "sweetalert";
import { SocketService } from 'src/app/model/service/http/socket.service';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'src/app/model/bean/user';

@Component({
    selector : 'workspace',
    templateUrl : './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {

        boarding : Board=new Board();
        bookmarks:BoardBookMark[]=[];
        boards : Board[]=[];

        pdf='pdf';
        excel='excel';
        html='html';
        path='';
        msg='';
        click!: boolean;
    
    constructor(
        public toggleStore : ToggleStore ,
        public route : ActivatedRoute ,
        public boardStore : BoardStore,
        public userService :UserService  ,
        public boardService : BoardService,
        private userStore : UserStore,
        private socketService : SocketService , 
     ){}

    ngOnInit(): void {
        document.title = "BBMS | My Workspace";
        this.userStore.fetchUserData();
        this.getBookMarks( this.userStore.user.id );
    }

    drop( e : CdkDragDrop<Board[]> ){}

     removeBoard(board : Board){
         this.boardStore.ownBoards = this.boardStore.ownBoards.filter( boarding=> boarding.id!=board.id );
         this.socketService.unsubscribeBoard( board.id ); // to unsubscribe removed boards
        ($('#delete-track')[0] as any).play();
    }


    // geting bookmarks for current logged in user
    getBookMarks( userId : number ){
        this.userService.getBookMarks( userId )
        .subscribe({
            next : resBookMarks => {
                this.bookmarks = resBookMarks;
            },
            error : err =>{
                console.log(err);
            }
        });
    }


    //toggling bookmark from children
    // will run if got emit from children
    toggleBookMark( bookMark : BoardBookMark ){
        !this.bookmarks.some( bookmark => bookmark.board.id == bookMark.board.id )
        ? this.bookmarks.push(bookMark)
        : this.bookmarks = this.bookmarks.filter( bookmark => bookmark.id != bookMark.id );
    }

    exportBoardReport(path:string) {

      let useridd = this.userStore.user.id;

        this.boardService.exportBoardReport(useridd,path).subscribe((res)=>{
            const blob = new Blob([res.body], { type : 'application/octet-stream'});

            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = `boards.${path=='excel' ? 'xlsx' : path.toLowerCase()}`,
            a.click();
            URL.revokeObjectURL(objectUrl);
            swal({
                text : 'Successfully Exported!',
                icon : 'success'
            });
        })

      }

    archiveBoard( board : Board ){
        this.userStore.fetchUserData();
        const isMyBoard = board.user.id == this.userStore.user.id;
        this.userService.archiveBoard( this.userStore.user , board )
        .subscribe( res => {
           if(res.ok){
             $(`#board-dropdown${board.id} .dropdown-menu`).hide();
             board.isArchive = true;
              this.boardStore.archivedBoards.push(board);
              this.boardStore.boards = this.boardStore.boards.filter( brd => brd.id != board.id );
              this.socketService.unsubscribeBoard( board.id );
              if(isMyBoard){
                this.boardStore.ownBoards = this.boardStore.ownBoards.filter( brd => brd.id != board.id );
              }else{
                this.boardStore.joinedBoards = this.boardStore.joinedBoards.filter( brd => brd.id != board.id );
              }
           }
        });
    }
}


