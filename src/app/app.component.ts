import { Component, OnInit  } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';
import { ToggleStore } from './model/service/store/toggle.service';

declare var $ : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  currentUrl : string = '';
  isExceptionPage : boolean = false;

  constructor( public router : Router , public toggleStore : ToggleStore ){
    this.router.events.subscribe( ( event ) => {
      if( event instanceof NavigationEnd ){
         this.currentUrl = event.url;
         this.isExceptionPage =  ['/','/login','/register','/verify-email','/forget-password'].includes(this.currentUrl) || this.currentUrl.includes('/this.register');
      }
    })
  }

}
