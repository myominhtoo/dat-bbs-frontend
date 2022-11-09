import { Component, OnInit } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';
import { Client  } from 'stompjs';
import { SocketService } from './model/service/http/socket.service';
import { BoardStore } from './model/service/store/board.store';
import { ToggleStore } from './model/service/store/toggle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  currentUrl : string = '';
  isExceptionPage : boolean = false;
  stompClient : Client | undefined = undefined;

  constructor( public router : Router ,
     public toggleStore : ToggleStore , 
     private socketService : SocketService ){
    this.router.events.subscribe( ( event ) => {
      if( event instanceof NavigationEnd ){
         this.currentUrl = event.url;
         this.isExceptionPage =  ['/','/login','/register','/verify-email','/forget-password'].includes(this.currentUrl) || this.currentUrl.includes('/this.register');
      }
    })
  }

  ngOnInit(): void {
    this.socketService.subscribeBoardsSocket();
  }

}
