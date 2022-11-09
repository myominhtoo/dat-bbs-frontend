import { Injectable } from "@angular/core";
import { Board } from "../../bean/board";
import { BoardService } from "../http/board.service";
import { UserStore } from "./user.store";

@Injectable({
    providedIn : 'root'
})
export class BoardStore{

    colorBoards:string[]=["#F06A6A","#9EE7E3","#A9C953","#4573D2","#6D6E6F","#8D84E8","#F8DF72","#E7B568","#F1BD6C"]

    public boards : Board [] = [];
    public ownBoards : Board [] = [];
    public joinedBoards : Board [] = [];

    public status = {
        isLoading : true,
        hasDoneFetching : false,
    }

    constructor( 
        private boaredService : BoardService , 
        public userStore : UserStore ){
        this.userStore.fetchUserData();
        if( this.userStore.user.id )  this.getBoardsByUserId( userStore.user.id );
    }
    
    public randomNumberBoard(){
        let number = Math.floor(Math.random() * this.colorBoards.length);
        return this.colorBoards[number];
    }    

    private getBoardsByUserId( userId : number ){
        this.status.isLoading = true;
        this.boaredService.getBoardsForUser( userId ).subscribe({
            next : datas => {
                this.boards= datas;

                this.ownBoards = this.boards.filter( board => {
                    board.color = this.randomNumberBoard();
                    return board.user.id == this.userStore.user.id
                });
                this.joinedBoards = this.boards.filter( board => {
                    board.color = this.randomNumberBoard();
                    return board.user.id != this.userStore.user.id
                });

                this.status.isLoading = false;
                this.status.hasDoneFetching = true;
            },
            error : err => {
                console.log(err);
            }
        });
    }
   
    
    public refetchBoardsByUserId( userId : number ){
        this.boards = [];
        this.getBoardsByUserId( userId );
    }

}