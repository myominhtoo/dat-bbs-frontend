import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { User } from "src/app/model/bean/user";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserService } from './../../../model/service/http/user.service';
import swal from "sweetalert";

@Component({
    selector : "profile",
    templateUrl : "./profile.component.html"
})

export class ProfileComponent{
  
    constructor( public toggleStore : ToggleStore,private userService : UserService){}
    storeUser = JSON.parse(atob(`${localStorage.getItem(btoa('user'))}`)); 
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
      this.getUserData(this.storeUser.id);
    }

    SaveUser(){
      this.user.username == null || this.user.username == ''
      ? this.status.error.username = { hasError : true , msg : 'User Name is required!'}
      : this.status.error.username = { hasError : false , msg : '' };
  
      this.user.email == null || this.user.email == ''
      ? this.status.error.email = { hasError : true , msg : 'Email is required!'}
      : this.status.error.email = { hasError : false , msg : '' };
    }

    getUserData( userId : number ){
      this.userService.getUser( userId )
      .subscribe({
        next : resUser => {
          this.user = resUser;
        },
        error : err => {
          console.log(err);
        }
      });
    }

    saveProfile(profile:NgForm){
     
      swal({
        text : 'Are you sure to update your profile?',
        icon : 'warning',
        buttons : [ 'No' , 'Yes' ]
      }).then( isYes => {
        if( isYes ){
          this.user=profile.value;
          this.user.id=this.storeUser.id;
          this.userService.updateUser(this.user).subscribe(
            {
              next:(res)=>{
                if( res.ok ){
                  swal({
                    text : res.message,
                    icon : 'success'
                  }).then(() => {
                    this.user = res.data;
                  })
                }
              },
              error:(err)=>{
                console.log(err)
              }
            }
          )
        }
      })
    }

    onFileChanged(event:any ){
       //Select File
      this.user.image =  event.target.files[0];
      console.log(this.user.image);
      const uploadImageData = new FormData();
      uploadImageData.append('file', this.user.image);

      this.userService.uploadPhoto( this.user.image ,this.user.id).subscribe({
        next:(res)=>{
              setTimeout(() => {
                this.user.imageUrl = res.data.imageUrl;
              } , 1000 );
        },
        error:(err)=>{
          console.log(err)
        }
      })    
    }
}