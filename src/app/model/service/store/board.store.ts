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
    public status = {
        isLoading : true
    }

    constructor( private boaredService : BoardService , private userStore : UserStore ){
        this.userStore.fetchUserData();
        if( this.userStore.user.id )  this.getBoardsByUserId( userStore.user.id );
    }
    
    public randomNumberBoard(){
        let number = Math.floor(Math.random() * this.colorBoards.length);
        return this.colorBoards[number];
    }    
        // this.userService.getBookMark(this.storeUser.id).subscribe({
        //     next:(res)=>{
                    
        //     },
        //     error:(err)=>{
        //         console.log(err)
        //     }
        // })
        

    private getBoardsByUserId( userId : number ){
        this.status.isLoading = true;
        this.boaredService.getBoardsForUser( userId ).subscribe({
            next : datas => {
                this.status.isLoading = false;
                this.boards = datas;
                this.boards=this.boards.map(res=> {
                    return{...res,color:this.randomNumberBoard()}
                });
                
                
                // console.log('running')
            },
            error : err => {
                console.log(err);
            }
        });
    }
   
    
    public refetchBoardsByUserId( userId : number ){
        this.getBoardsByUserId( userId );
    }

}