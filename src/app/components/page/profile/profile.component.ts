import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { User } from "src/app/model/bean/user";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserService } from './../../../model/service/http/user.service';
import swal from "sweetalert";
import { UserStore } from "src/app/model/service/store/user.store";

@Component({
    selector : "profile",
    templateUrl : "./profile.component.html"
})

export class ProfileComponent{
  
    constructor( public toggleStore : ToggleStore ,  
      private userService : UserService , 
      public userStore : UserStore
       ){
        this.userStore.fetchUserData();
       }

    storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`)))); 
    user : User = new User();
    userInfo:User=new User();
    imgValue:any;
    status = {
        preview:{
          ok:false,
          textShow:false
        },
        update : {
          idx : 0,
          willUpdate : false
        },
        isLoading : false,
      }

    ngOnInit(): void {      
      this.imgValue=null;
      this.getUserData(this.storeUser.id);
      document.title = "BBMS | Profile";

      
    }


    getUserData( userId : number ){
      this.userService.getUser( userId )
      .subscribe({
        next : resUser => {
          
          this.user = resUser;          
          this.userInfo={...this.user};
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
                    this.userInfo={...this.user}
                    // this.userStore.saveUserData( res.data );
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
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(this.user.image);
        reader.onload = () => {
         this.imgValue= reader.result as string;
         this.status.preview.textShow=false;
        };
  
      }
    }
    previewImg(bol:boolean){
      this.status.preview.ok=bol;
      if( this.status.preview.ok){
        this.status.preview.textShow=false;
        this.userService.uploadPhoto( this.user.image ,this.user.id).subscribe({
          next:(res)=>{
                setTimeout(() => {
                  this.imgValue = null;
                  this.user.imageUrl = res.data.imageUrl;
                  this.userStore.saveUserData( res.data );
                } , 500 );
      
          },
          error:(err)=>{
            console.log(err)
          }
        })    
      }else{
        this.imgValue=null
        this.status.preview.textShow=false;
        this.user.imageUrl=this.storeUser.imageUrl;     
      }
    }
}