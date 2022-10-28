import { Component } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';

declare var $ : any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentUrl : string = '';

  constructor( public router : Router ){
    this.router.events.subscribe( ( event ) => {
      if( event instanceof NavigationEnd ){
        console.log(event.url.includes('/register'))
         this.currentUrl = event.url;
      }
    })
  }

}
