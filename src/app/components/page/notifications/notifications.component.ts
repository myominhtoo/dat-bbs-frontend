import { Component, OnInit } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import * as SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';
import * as Toastify from 'toastify-js'

@Component({
    selector : 'notifications',
    templateUrl  : './notifications.component.html'
})
export class NotificationsComponent implements OnInit{

    stompClient : Client | undefined;

    constructor( public toggleStore : ToggleStore ){document.title = "BBMS | Notification";}

    ngOnInit(): void {
        this.connectSocket();
      }
  
      connectSocket(){
        const socket = new SockJS( 'http://localhost:8080/socket' );
        this.stompClient = over( socket );
        this.stompClient.connect( {} , 
        () => {
          
        },
        () => {
          console.log('erro')
        });
      }

      sendNoti(){
        // const notification = new Notification();
        // notification.content = "Hello World";
        // const board = new Board();
        // board.id = 163;
        // notification.board = board;
        // this.stompClient?.send( `/app/boards/163/send-notification` , {} , JSON.stringify(notification) );
    
        Toastify({
          text : 'Hello',
          close : true,
          duration : 3000,
          gravity : 'bottom',
          position : 'right'
        }).showToast();
      }


}