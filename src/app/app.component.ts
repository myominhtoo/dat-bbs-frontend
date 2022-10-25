import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { map } from 'rxjs';

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
         this.currentUrl = event.url;
      }
    })
  }

}
