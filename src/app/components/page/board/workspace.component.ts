import { BoardBookMark } from './../../../model/bean/BoardBookMark';
import { UserService } from 'src/app/model/service/http/user.service';
import { Component, Input, OnInit } from "@angular/core";
import { BoardStore } from "src/app/model/service/store/board.store";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { CdkDragDrop , moveItemInArray } from '@angular/cdk/drag-drop';
import { Board } from "src/app/model/bean/board";
import { ActivatedRoute, Router } from "@angular/router";
import { UserStore } from 'src/app/model/service/store/user.store';
import { BoardService } from 'src/app/model/service/http/board.service';
// import * as XLSX from 'xlsx';
import swal from "sweetalert";

@Component({
    selector : 'workspace',
    templateUrl : './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {

    storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`))));
    boarding : Board=new Board();
    bookmarks:BoardBookMark[]=[];
    boards : Board[]=[];

    status = {
        isLoading : false,
        hasDoneFetching : false,
    }
    // fileName='board.xlsx';
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
        private router : Router ,
        private userStore : UserStore  ){

        }

    ngOnInit(): void {
        document.title = "BBMS | My Workspace";
        this.getBookMarks( this.userStore.user.id );
    }

    drop( e : CdkDragDrop<Board[]> ){}

     removeBoard(board : Board){
         this.boardStore.ownBoards = this.boardStore.ownBoards.filter( boarding=> boarding.id!=board.id );
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

    archiveBoards(){
        this.router.navigateByUrl(`/archive-boards`,);
    }

    restoreBoard(board : Board){
        this.boardStore.ownBoards = this.boardStore.ownBoards.filter(resBoard=> resBoard.id!=board.id)
    }

    exportBoardReport(path:string) {

      let useridd=this.userStore.user.id;
      console.log(useridd);
        this.boardService.exportBoardReport(useridd,path).subscribe((data)=>{
            swal({
                text : 'Successfully Exported!',
                icon : 'success'
            });
        })

      }


    //   isClick(con:boolean,filetype:string){
    //     this.boardService.exportReport(filetype).subscribe(data=>
    //         {
    //         this.msg = Object.values(data)[0];
    //      });
    //      alert("fail");
    //     this.click=con;
    //     }

}


