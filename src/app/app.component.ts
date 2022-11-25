import { Component, OnInit } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';
import { Client  } from 'stompjs';
import { SocketService } from './model/service/http/socket.service';
import { ToggleStore } from './model/service/store/toggle.service';
import { AuthService } from './model/service/http/auth.service';
import { UserStore } from './model/service/store/user.store';
import { NotificationStore } from './model/service/store/notification.store';

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
     private socketService : SocketService ,
     private authService : AuthService ,
     private userStore : UserStore ,
     private notiStore : NotificationStore ){
    this.router.events.subscribe( ( event ) => {
      if( event instanceof NavigationEnd ){
         this.currentUrl = event.url;
         if(this.currentUrl.includes('?')){
           this.currentUrl = this.currentUrl.split('?')[0];
         }
         this.isExceptionPage =  ['/','/login','/register','/verify-email','/forget-password'].includes(this.currentUrl) || this.currentUrl.includes('/register');
      }
    })
  }

  ngOnInit(): void {
    if(this.authService.isAuth()){
       this.userStore.fetchUserData();
       setTimeout(() => {
        this.socketService.subscribeNotis();
        this.notiStore.reFetchNotis( this.userStore.user.id );
        this.socketService.subscribeBoardsMessageSocket();        

       }, 1500 );
    }
  }

}
