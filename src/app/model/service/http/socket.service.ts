import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as SockJS from "sockjs-client";
import { Client, Message, over, Subscription } from "stompjs";
import swal from "sweetalert";
import * as Toastify from 'toastify-js';
import { Board } from '../../bean/board';
import { Notification } from "../../bean/notification";
import { User } from '../../bean/user';
import { BoardStore } from "../store/board.store";
import { NotificationStore } from '../store/notification.store';
import { UserStore } from '../store/user.store';
import { BoardMessage } from './../../bean/BoardMessage';
import { AuthService } from './auth.service';
import { BoardService } from './board.service';


@Injectable({
    providedIn : 'root'
})
export class SocketService{
    board : Board = new Board();
    stompClient : Client | undefined = undefined;
    boardNotisSubscriptions : Subscription [] = [];
    privateNotiSubscription : Subscription | undefined;

    status = {
        hadGotVerification : false,
        hadError : false
    }

    constructor( 
        public boardStore : BoardStore , 
        private httpClient : HttpClient ,
        private notiStore : NotificationStore,
        private authService : AuthService,
        private userStore : UserStore ,
        private route : ActivatedRoute ,
        private router : Router,
        private boardService : BoardService,
    ){  
        if( authService.isAuth() ) {
           this.getSocketClient();
           this.userStore.fetchUserData();
        }
    }

    subscribeNotis(){
       this.getSocketClient();
        if(this.stompClient){
            this.stompClient.connect( {} ,
                () => {
                    this.subscribeToPrivateNoti();
                    this.boardStore.boards.forEach( board => {
                        const subscription =  this.stompClient?.subscribe( `/boards/${board.id}/notifications` , ( payload ) => {
                            // const newNoti = JSON.parse(payload.body) as Notification;
                            // if( newNoti.sentUser.id != this.boardStore.userStore.user.id ){
                            //    ($('#noti-ring')[0] as HTMLAudioElement).play();
                            //     Toastify({
                            //         text : newNoti.content,
                            //         close : true,
                            //         duration : 5000,
                            //         gravity : 'bottom',
                            //         className : 'noti__toast',
                            //         position : 'right',
                            //     }).showToast();     
                            //     this.notiStore.notifications.unshift( newNoti );
                            // }        
                            this.showNoti( payload );
                        });       
                        subscription!.id = `board-${board.id}`;
                        this.boardNotisSubscriptions.push(subscription!);
                    });
                }, 
                () => {
                    swal({
                        text : 'Failed to connect to socket!',
                        icon : 'warning'
                    });
                });
        }else{
            swal({
                text : 'Invalid Socket Connection!',
                icon : 'warning'
            });
        }
    }

    private showNoti( payload : Message ){
        const newNoti = JSON.parse(payload.body) as Notification;
        if( newNoti.sentUser.id != this.boardStore.userStore.user.id ){
        ($('#noti-ring')[0] as HTMLAudioElement).play();
            let currentUrl = window.location.href;
            currentUrl = currentUrl.replace('http://localhost:4200','');
            console.log(newNoti)
             Toastify({
                text : newNoti.content,
                close : true,
                duration : 10000,
                gravity : 'bottom',
                className : 'noti__toast',
                position : 'right',
                onClick : () => {
                    if( newNoti.invitiation ){
                        if(!this.boardStore.joinedBoards.some(board=> board.id == newNoti.board?.id)){
                            swal({
                                text : 'Are you sure to join this board?',
                                icon : 'warning',
                                buttons : [ 'No' , 'Yes' ]
                            }).then( isYes => {
                                if(isYes){
                                    // code to connect backend
                                    this.userStore.fetchUserData;
                                   // console.log(newNoti);
                                     this.boardService.joinBoard(this.userStore.user.email,newNoti.board?.code!,newNoti.board?.id!).subscribe({
                                         next:(res)=>{
                                             if(res.ok){
                                                 this.status.hadGotVerification=true;
                                                //  this.boardStore.boards.push(boardData);
                                                 swal({
                                                     text : "Successfully!",
                                                     icon : 'success'
                                                   }).then( () => {
                                                    
                                                    this.boardStore.boards.push(newNoti.board!);
                                                    this.boardStore.joinedBoards.push(newNoti.board!);
                                                    this.sendNotiBackToInviter(newNoti.board!,newNoti.sentUser);
                                                    this.router.navigateByUrl(`/boards/${newNoti.board?.id}`);
                                                 
                                                   })
                                             } 
                                         },
                                         error : err => {
                                             this.status.hadError=true;
                                             console.log(err);
                                         }
                                     })
                                }
                            })
                        }
                      
                    }else{
                        const targetUrl = `/boards/${newNoti.board?.id}`;
                        if( currentUrl === targetUrl  ){
                            window.location.href = targetUrl;
                        }else{
                            this.router.navigateByUrl(targetUrl);
                        }
                    }
                }
            }).showToast();     
                this.notiStore.notifications.unshift( newNoti );
        }        
    }
    
    subscribeBoard( boardId : number ) : void {
        // this.getSocketClient();
        if(this.stompClient){
            const subscription = this.stompClient.subscribe( `/boards/${boardId}/notifications` , 
                ( payload ) => {
                    this.showNoti(payload);
                },
                () => {
                    swal({
                        text : 'Failed to connect to socket!',
                        icon : 'warning'
                    });
                }
            )
            subscription.id = `board-${boardId}`;
            this.boardNotisSubscriptions.push(subscription);
        }
    }

    unsubscribeBoard( boardId : number ) : void {
    //    this.getSocketClient();
        if(this.stompClient){
           const targetChannel = this.boardNotisSubscriptions.filter( subscription => subscription.id == `board-${boardId}`);
           if(targetChannel.length > 0 ) targetChannel[0].unsubscribe();
        }
    }

    sentNotiToBoard( boardId : number , noti : Notification  ){
        if( this.stompClient ){
            this.stompClient.send( `/app/boards/${boardId}/send-notification` , {} , JSON.stringify(noti) );
        }else{
            swal({
                text : 'Invalid Socket Client!',
                icon : 'warning'
            });
        }
    }

    sentMeesageToGroupChat( boardId : number , message : BoardMessage  ){
        if( this.stompClient ){
            this.stompClient.send( `/app/boards/${boardId}/send-message` , {} , JSON.stringify(message) );
        }else{
            swal({
                text : 'Invalid Socket Client!',
                icon : 'warning'
            });
        }
    }


    public getBoardMessageList(id:number):Observable<BoardMessage[]>{
        return this.httpClient.get<BoardMessage[]>(`http://localhost:8080/api/boards/${id}/messages`);
    }     

    /*
        to send internal noti for registered users when invite board
    */
    public sendBoardInvitiationNotiToUsers(  board : Board , users : User [] ){
        if(this.stompClient){
            users.forEach( user => {
                const noti = new Notification();
                noti.content = `${this.userStore.user.username} invited you to join \n "${board.boardName} Board" \n Click Here to Join!`;
                noti.sentUser = this.userStore.user;
                noti.board = board;
                noti.invitiation = true;
                
                this.stompClient?.send( `/app/users/${user.id}/send-notification` , {} , JSON.stringify(noti) );
            });
        }
    }

    public sendNotiBackToInviter ( board : Board , user : User){
        if ( this.stompClient){
            const noti = new Notification();
            noti.content = `${this.userStore.user.username} accepted your Invitation to join \n "${board.boardName} Board" `;
            noti.sentUser = this.userStore.user;
            noti.board = board;
            noti.invitiation = false;
            this.stompClient?.send( `/app/users/${user.id}/send-notification` , {} , JSON.stringify(noti) );
        }
    }
    
    /*
     for invitiation noti 
    */
    private subscribeToPrivateNoti(){
            this.privateNotiSubscription = this.stompClient?.subscribe( `/users/${this.userStore.user.id}/notifications` , 
            ( payload ) => {
                this.showNoti(payload);
            });               
    }
    
    private getSocketClient(){
        const socket = new SockJS( 'http://localhost:8080/socket' );
        this.stompClient = over( socket );
    }

    

}