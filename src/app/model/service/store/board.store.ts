import { Injectable, Injector } from "@angular/core";
import { Board } from "../../bean/board";
import { AuthService } from "../http/auth.service";
import { BoardService } from "../http/board.service";
import { UserStore } from "./user.store";
import { UserService } from '../http/user.service';
import { forkJoin } from 'rxjs';
import swal from 'sweetalert';
import { ActivatedRoute, Route, Router } from "@angular/router";
import { SocketService } from "../http/socket.service";
import { Notification } from "../../bean/notification";

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
        removedBoardId : 0,
        isRemovedMyBoard : false,
    }

    constructor( 
        private boardService : BoardService , 
        public userStore : UserStore ,
        private authService : AuthService ,
        private userService : UserService ,
        private router : Router ,
        private route : ActivatedRoute,
        private injector : Injector
        ){
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
            this.boardService.getBoardsForUser( userId ),
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
   
    public leaveBoard( board : Board ){
        this.userStore.fetchUserData();     
        this.boardService.leaveFromBoard( board.id , this.userStore.user.id ).subscribe( res => {
               if( res.ok ){
                const isMyBoard = board.user.id == this.userStore.user.id;
                const nextOwner = res.data.user;

                const socketService = this.injector.get(SocketService);
                socketService.unsubscribeBoard( board.id );
                this.status.removedBoardId = board.id;
                this.status.isRemovedMyBoard = board.user.id == this.userStore.user.id;

                const noti = new Notification();
                noti.board = board;
                noti.sentUser = this.userStore.user;
                noti.invitiation = false;
                noti.seenUsers = [];

                // for giving admin to other member
                if( isMyBoard && nextOwner != null ){
                    noti.content = `${this.userStore.user.username}(Admin) left ${board.boardName} Board and ${nextOwner.username} is ADMIN Now!`
                }else{
                    noti.content = `${this.userStore.user.username}(${board.user.id == this.userStore.user.id ? 'Admin' : 'Member' }) left \n ${board.boardName} board!`;
                }
            
                socketService.sentNotiToBoard( noti.board.id , noti );
            
                const currentUrl = window.location.href.split('/');

                if( currentUrl[currentUrl.length - 1] == 'boards' ){
                    window.location.href = `/boards`
                }else{
                    this.router.navigateByUrl(`/boards`);
                }          
            }
         })
    }

}