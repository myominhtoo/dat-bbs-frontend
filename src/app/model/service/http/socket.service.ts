import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BoardMessage } from './../../bean/BoardMessage';
import { Injectable } from "@angular/core";
import * as SockJS from "sockjs-client";
import { Client, Message, over, Subscription } from "stompjs";
import swal from "sweetalert";
import { Notification } from "../../bean/notification";
import { BoardStore } from "../store/board.store";
import * as Toastify from 'toastify-js';
import { NotificationStore } from '../store/notification.store';
import { AuthService } from './auth.service';
import { UserStore } from '../store/user.store';


@Injectable({
    providedIn : 'root'
})
export class SocketService{

    stompClient : Client | undefined = undefined;
    boardNotisSubscriptions : Subscription [] = [];

    constructor( 
        public boardStore : BoardStore , 
        private httpClient : HttpClient ,
        private notiStore : NotificationStore,
        private authService : AuthService
    ){  
        if( authService.isAuth() ) {
           this.getSocketClient();
        }
    }

    subscribeBoardsSocket(){
       this.getSocketClient();
        if(this.stompClient){
            this.stompClient.connect( {} ,
                () => {
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

    showNoti( payload : Message ){
        const newNoti = JSON.parse(payload.body) as Notification;
        if( newNoti.sentUser.id != this.boardStore.userStore.user.id ){
        ($('#noti-ring')[0] as HTMLAudioElement).play();
             Toastify({
                text : newNoti.content,
                close : true,
                duration : 5000,
                gravity : 'bottom',
                className : 'noti__toast',
                position : 'right',
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
    
    
    private getSocketClient(){
        const socket = new SockJS( 'http://localhost:8080/socket' );
        this.stompClient = over( socket );
    }
}