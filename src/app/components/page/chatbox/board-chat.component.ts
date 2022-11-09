import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from './../../../model/service/http/user.service';
import { Component } from "@angular/core";

@Component({
    selector:"board-chat",
    templateUrl:"./board-chat.component.html"
})

  

export class BoardChatComponent{

    constructor(
        private UserService : UserService,
        private Router: Router,
        public route : ActivatedRoute
    
      ){
       let profileId=this.route.snapshot.params['id'];
       console.log(profileId);      
      }
    }

