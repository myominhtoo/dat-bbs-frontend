import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { User } from "src/app/model/bean/user";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserService } from './../../../model/service/http/user.service';

@Component({
    selector : "profile",
    templateUrl : "./profile.component.html"
})

export class ProfileComponent{
    constructor( public toggleStore : ToggleStore,private userService : UserService){}

    user : User = new User();

    status = {
        update : {
          idx : 0,
          willUpdate : false
        },
        error : {
            username : {
              hasError : false,
              msg : '',
            },
          email : {
            hasError : false,
            msg : ''
          }
        },
        isLoading : false,
      }

      ngOnInit(): void {
        let storeUser = localStorage.getItem(btoa('user'));
    }

      SaveUser(){

        // const user = new User();
        // user.id = 1;
        // this.board.user = user;
        // this.board.invitedEmails = this.emails;
        // this.status.isLoading = true;
    
  
        this.user.username == null || this.user.username == ''
        ? this.status.error.username = { hasError : true , msg : 'User Name is required!'}
        : this.status.error.username = { hasError : false , msg : '' };
  
        this.user.email == null || this.user.email == ''
        ? this.status.error.email = { hasError : true , msg : 'Email is required!'}
        : this.status.error.email = { hasError : false , msg : '' };
  
        
        // if( !this.status.error.username.hasError && !this.status.error.email.hasError ){
        //   this.boardService.createBoard(this.board)
        //   .subscribe({
        //     next : data => {
        //       this.status.isLoading = false;
        //       console.log(data);
        //       alert("Succesfully Created!");
        //     },
        //     error : err => {
        //       this.board.boardName = '';
        //       this.board.description = '';
  
        //     }
        //   });
    
        // }
    }

  saveProfile(profile:NgForm){
//      console.log(this.user)
//     this.userService.ProfileUser(this.user).subscribe({
//       next:(res)=>{
//                   console.log("Work!!")
        
//       },
// er
//     }
//     )
    }
}