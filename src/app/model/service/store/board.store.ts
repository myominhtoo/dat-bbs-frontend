import { Injectable } from "@angular/core";
import { Board } from "../../bean/board";
import { AuthService } from "../http/auth.service";
import { BoardService } from "../http/board.service";
import { UserStore } from "./user.store";
import { UserService } from '../http/user.service';
import { forkJoin } from 'rxjs';

@Injectable({
    providedIn : 'root'
})
export class BoardStore{

    colorBoards:string[]=["#F06A6A","#9EE7E3","#A9C953","#4573D2","#6D6E6F","#8D84E8","#F8DF72","#E7B568","#F1BD6C"]

    public boards : Board [] = [];
    public ownBoards : Board [] = [];
    public joinedBoards : Board [] = [];

    public archivedBoards : Board [] = [];
    
    public status = {
        isLoading : true,
        hasDoneFetching : false,
        removedBoardId : null,
        isRemovedMyBoard : false,
    }

    constructor( 
        private boaredService : BoardService , 
        public userStore : UserStore ,
        private authService : AuthService ,
        private userService : UserService ){
        if( authService.isAuth() ){
            this.userStore.fetchUserData();
            if( this.userStore.user.id )  this.getBoardsByUserId( userStore.user.id ); 
        }
    }
    
    public randomNumberBoard(){
        let number = Math.floor(Math.random() * this.colorBoards.length);
        return this.colorBoards[number];
    }    

    public getBoardsByUserId( userId : number ){
        this.status.isLoading = true;

        forkJoin([
            this.boaredService.getBoardsForUser( userId ),
            this.userService.getArchiveBoards( userId )            
        ]).subscribe( ([ allBoards , archivedBoards ]) => {
            this.boards = allBoards.filter( board => {
                return !archivedBoards.map( brd => brd.id ).includes(board.id);
            }).map( filteredBoard => {
                return { ...filteredBoard , isArchive : false }
            });
            
            this.ownBoards = this.boards.filter( board => {
                board.color = this.randomNumberBoard();
                // board.user.iconColor = this.userStore.user.iconColor;
                return board.user.id == this.userStore.user.id
            });
            this.joinedBoards = this.boards.filter( board => {
                board.color = this.randomNumberBoard();
                return board.user.id != this.userStore.user.id;
            });
            this.archivedBoards  = archivedBoards;
            this.status.isLoading = false;
            this.status.hasDoneFetching = true;
        })
    }
    public refetchBoardsByUserId( userId : number ){
        this.boards = [];
        this.getBoardsByUserId( userId );
    }
}