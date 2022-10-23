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
    storeUser = JSON.parse(atob(`${localStorage.getItem(btoa('user'))}`)); 
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
    this.user.username=this.storeUser.username;
    }

      SaveUser(){
        this.user.username == null || this.user.username == ''
        ? this.status.error.username = { hasError : true , msg : 'User Name is required!'}
        : this.status.error.username = { hasError : false , msg : '' };
  
        this.user.email == null || this.user.email == ''
        ? this.status.error.email = { hasError : true , msg : 'Email is required!'}
        : this.status.error.email = { hasError : false , msg : '' };
  

    }

  saveProfile(profile:NgForm){
    }

    onFileChanged(event:any ){
       //Select File
    this.user.image =  event.target.files[0];
    console.log(this.user.image);
    const uploadImageData = new FormData();
    uploadImageData.append('file', this.user.image, this.user.image.name);

    this.userService.uploadPhoto(uploadImageData,this.storeUser.id).subscribe({
      next:(res)=>{
              this.user.imageUrl=res.imageUrl;
              console.log("It's works"+res.imageUrl)
      },
      error:(err)=>{
        console.log(err)
      }
    })
    
    }
}