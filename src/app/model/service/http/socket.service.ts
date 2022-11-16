import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BoardMessage } from './../../bean/BoardMessage';
import { Injectable } from "@angular/core";
import * as SockJS from "sockjs-client";
import { Client, over } from "stompjs";
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

    constructor( 
        public boardStore : BoardStore , 
        private httpClient : HttpClient ,
        private notiStore : NotificationStore
    ){}

    subscribeBoardsSocket(){
        const socket = new SockJS( 'http://localhost:8080/socket' );
        this.stompClient = over( socket );
        if(this.stompClient){
            this.stompClient.connect( {} ,
                () => {
                    this.boardStore.boards.forEach( board => {
                        this.stompClient?.subscribe( `/boards/${board.id}/notifications` , ( payload ) => {
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
                        });       
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
}