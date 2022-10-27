import { Injectable } from "@angular/core";
import { Board } from "../../bean/board";
import { BoardService } from "../http/board.service";
import { UserStore } from "./user.store";

@Injectable({
    providedIn : 'root'
})
export class BoardStore{
    public boards : Board [] = [];
    public status = {
        isLoading : true
    }

    constructor( private boaredService : BoardService , private userStore : UserStore ){
        this.userStore.fetchUserData();
        if( this.userStore.user.id )  this.getBoardsByUserId( userStore.user.id );
    }

    private getBoardsByUserId( userId : number ){
        // console.log('helo')
        this.status.isLoading = true;
        this.boaredService.getBoardsForUser( userId )
        .subscribe({
            next : datas => {
                this.status.isLoading = false;
                this.boards = datas;
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