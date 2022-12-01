import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { User } from "src/app/model/bean/user";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserService } from './../../../model/service/http/user.service';
import swal from "sweetalert";
import { UserStore } from "src/app/model/service/store/user.store";
import { AuthService } from "src/app/model/service/http/auth.service";

@Component({
    selector : "profile",
    templateUrl : "./profile.component.html"
})

export class ProfileComponent{

    constructor( public toggleStore : ToggleStore ,
      private userService : UserService ,
      public userStore : UserStore ,
      private authService : AuthService
      ){
        this.userStore.fetchUserData();
      }


    user : User = new User();
    userInfo:User=new User();
    confirmInput=document.createElement("input");
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
        changePassword:{
          msg:"",
          ok:false
        },
        isUploading : false,
      }

  ngOnInit(): void {
      this.imgValue=null;
      this.userStore.fetchUserData();
      this.getUserData(this.userStore.user.id);
      document.title = "BBMS | Profile";
  }

  getUserData( userId : number ){
      this.userService.getUser( userId )
      .subscribe({
        next : resUser => {
          this.user = resUser;
          this.user.iconColor = this.userStore.user.iconColor;
          this.userInfo= {...this.user };
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
        closeOnClickOutside: false,
        buttons : [ 'No' , 'Yes' ]
      }).then( isYes => {
        if( isYes ){
          swal({
            text : 'Enter your password to confirm',
            closeOnClickOutside: false,
            content : {
              element : 'input',
              attributes: {
                placeholder: "Type your password",
                type: "password",
              }
            }
          }).then( confirmpassword => {
            this.user.confirmpassword = confirmpassword;
            this.user.password = confirmpassword;
            this.user.image = null;
            this.userService.updateUser(this.user).subscribe(
              {
                next:(res)=>{
                  if( res.body.ok ){
                    this.user = res.body.data!;
                    this.userInfo = {...this.user};
                    this.authService.saveToken( res.headers.get('Authorization')! ); 

                    swal({
                      text : res.body.message,
                      icon : 'success',
                      closeOnClickOutside: false
                    }).then(() => {
                      this.userStore.saveUserData( res.body.data );
                    })
                  }
                },
                error:(err)=>{
                  swal({
                    text:"Wrong Password",
                    icon:"error",
                    closeOnClickOutside: false
                  }).then( () =>{
                    console.log(this.userInfo);
                    this.user={...this.userInfo};
                  })
                }
              }
            )
          })
        } else {
                    this.user={...this.userInfo};
        }
      }
      )
  }
  cencelProfile() {
    this.user={...this.userInfo};
  }

  onFileChanged(event:any ){
      this.user.image =  event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(this.user.image!);
        reader.onload = () => {
         this.imgValue= reader.result as string;
         this.status.preview.textShow=false;
        };
    }
  }

  previewImg(bol: boolean) {
    
    if (bol) {   
        this.status.preview.textShow = false;
        this.status.isUploading = true;
        this.userService.uploadPhoto( this.user.image! ,this.user.id).subscribe({
          next: (res) => {
          this.status.preview.ok=true      
            setTimeout(() => {
              this.status.isUploading = false;
              this.imgValue = null;
              this.user.imageUrl = res.data.imageUrl;
              this.userInfo.imageUrl = res.data.imageUrl;
              this.userStore.saveUserData(res.data);                   
            }, 3000);                  
  
          },
          error:(err)=>{
            console.log(err)
          }
                            
        })
      
      }else{
        this.imgValue = null
        this.status.preview.textShow=false;
        $('#file').val('');
    }
    
    setTimeout(() => {
              this.status.preview.ok=false      
    },3000);
    
  }

  textImg(){
    this.userService.delteImage(this.userInfo).subscribe({
      next:(res)=>{
          this.userStore.fetchUserData();
          this.user = res.data;
          this.user.iconColor = this.userStore.user.iconColor;
          this.userInfo = {...this.user}
          
          this.userStore.saveUserData( res.data );
      },
      error:(err)=>{
                  console.log(err)
      }
    })
  }

  handleRemoveImage(){
     if( this.user.imageUrl != null ){
        swal({
          text : 'Are you sure to remove image?',
          icon : 'warning',
          buttons : [ 'No' , 'Yes' ]
        }).then( isYes => {
          if(isYes){
            this.textImg();
          }
        })
     }
    }

}

