import { BoardsHasUsers } from './../../bean/BoardsHasUser';
import { User } from './../../bean/user';
import { Injectable } from "@angular/core";
import { Board } from "../../bean/board";
import { AuthService } from "../http/auth.service";
import { BoardService } from "../http/board.service";
import { UserStore } from "./user.store";
import { UserService } from '../http/user.service';
@Injectable({
    providedIn : 'root'
})
export class BoardStore{

    colorBoards:string[]=["#F06A6A","#9EE7E3","#A9C953","#4573D2","#6D6E6F","#8D84E8","#F8DF72","#E7B568","#F1BD6C"]

    public boards : Board [] = [];
    public ownBoards : Board [] = [];
    public joinedBoards : Board [] = [];
    public boardsHasUsers:BoardsHasUsers[]=[];    
    public status = {
        isLoading : true,
        hasDoneFetching : false,
    }

    constructor( 
        private boaredService : BoardService , 
        private userService:UserService ,
        public userStore : UserStore ,
        private authService : AuthService ){
        if( authService.isAuth() ){
            this.userStore.fetchUserData();
            if( this.userStore.user.id )  this.getBoardsByUserId( userStore.user.id ); 
        }
    }
    
    public randomNumberBoard(){
        let number = Math.floor(Math.random() * this.colorBoards.length);
        return this.colorBoards[number];
    }    

    private getBoardsByUserId( userId : number ){
        this.status.isLoading = true;
        this.boaredService.getBoardsForUser( userId ).subscribe({
            next : datas => {                
                this.boards= datas.map( data => {
                    return { ...data , color : this.randomNumberBoard() };
                })

                this.ownBoards = this.boards.filter( board => {
                    board.color = this.randomNumberBoard();
                    return board.user.id == this.userStore.user.id
                });
                this.joinedBoards = this.boards.filter( board => {
                    board.color = this.randomNumberBoard();
                    return board.user.id != this.userStore.user.id;
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
    public getAllMembers(userId:number){
        this.userService.getAllMembers(userId).subscribe({
            next:(res)=>{                      
                this.boardsHasUsers=res.data.map((data)=> data);
                
            },error:(err)=>{
                console.log(err)
            }
        })
    }

}