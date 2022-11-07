import { BoardBookMark } from './../../../model/bean/BoardBookMark';
import { UserService } from 'src/app/model/service/http/user.service';
import { Component, Input, OnInit } from "@angular/core";
import { BoardStore } from "src/app/model/service/store/board.store";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { CdkDragDrop , moveItemInArray } from '@angular/cdk/drag-drop';
import { Board } from "src/app/model/bean/board";
import swal from 'sweetalert';
import { BoardService } from "src/app/model/service/http/board.service";
import { Router } from "@angular/router";
import { UserStore } from 'src/app/model/service/store/user.store';

@Component({
    selector : 'workspace',
    templateUrl : './workspace.component.html'
})
export class WorkspaceComponent implements OnInit {

    storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`))));
    boarding : Board=new Board();
    bookmarks:BoardBookMark[]=[];
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
        public boardStore : BoardStore,
        public userService :UserService  ,
        private router : Router , 
        private userStore : UserStore  ){}

    ngOnInit(): void {
        setTimeout(() => {
                this.getBoards();
        } , 100  );
        document.title = "BBMS | My Workspace";
        this.getBookMarks( this.userStore.user.id );
    }

    drop( e : CdkDragDrop<Board[]> ){}

     removeBoard(board : Board){
         this.ownerBoards=this.ownerBoards.filter(boarding=> boarding.id!=board.id)
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


    // geting bookmarks for current logged in user
    getBookMarks( userId : number ){
        this.userService.getBookMarks( userId )
        .subscribe({ 
            next : resBookMarks => {
                console.log(resBookMarks)
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
        this.ownerBoards=this.ownerBoards.filter(resBoard=> resBoard.id!=board.id)
    }

}


