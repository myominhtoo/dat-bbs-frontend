import { Injectable } from "@angular/core";
import * as SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import swal from "sweetalert";
import { Notification } from "../../bean/notification";
import { BoardStore } from "../store/board.store";
import * as Toastify from 'toastify-js';

@Injectable({
    providedIn : 'root'
})
export class SocketService{

    stompClient : Client | undefined = undefined;

    constructor( public boardStore : BoardStore ){
        const socket = new SockJS( 'http://localhost:8080/socket' );
        this.stompClient = over( socket );
    }

    subscribeBoardsSocket(){
        if(this.stompClient){
            this.stompClient.connect( {} ,
                () => {
                    //subscribing boards channel
                    this.boardStore.boards.forEach( board => {
                        this.stompClient?.subscribe( `/boards/${board.id}/notifications` , ( payload ) => {
                            const newNoti = JSON.parse(payload.body) as Notification;
                            Toastify({
                                text : newNoti.content,
                                close : true,
                                duration : 2000,
                                gravity : 'bottom',
                                className : 'noti__toast',
                                position : 'right'
                            }).showToast();
                    
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
            this.stompClient.send( `/boards/${boardId}/send-notification` , {} , JSON.stringify(noti) );
        }else{
            swal({
                text : 'Invalid Socket Client!',
                icon : 'warning'
            });
        }
    }

}