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
    userPass={
      changePassword:"",
      currentPassword:"",
      retypePassoword:""      
    }
    storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`)))); 
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
        }
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
          console.log(resUser)
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
            text : 'Confirm Your Old Password',
            closeOnClickOutside: false,
            content : {
              element : 'input',
              attributes: {
                placeholder: "Type your password",
                type: "password",
              }
            }
          }).then( confirmpassword => {
            this.user.confirmpassword=confirmpassword;
            this.user.id=this.storeUser.id;
            this.userService.updateUser(this.user).subscribe(
              {
                next:(res)=>{
                  if( res.ok ){
                    swal({
                      text : res.message,
                      icon : 'success',
                      closeOnClickOutside: false
                    }).then(() => {
                      
                      this.user = res.data;
                      this.userInfo={...this.user}                      
                      this.userStore.saveUserData( res.data );
                      this.user.password="";
                    })
                  }
                },
                error:(err)=>{                
                  swal({
                    text:"Wrong Password",
                    icon:"error",
                    closeOnClickOutside: false          
                  }).then(_=>{
                    this.user={...this.userInfo};
                  })
                  
                }
              }
            )
          })
          

        }else{
          
              this.user={...this.userInfo};
            
          
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
      }
    }

    changePassword(){
    
      // console.log(this.userInfo)
console.log(this.userPass.currentPassword);
console.log(this.userPass.currentPassword);
console.log(this.userPass.retypePassoword);
console.log(this.user)
if(this.userPass.changePassword ==this.userPass.retypePassoword){
  this.userInfo.password=this.userPass.changePassword;
  this.userInfo.confirmpassword=this.userPass.currentPassword;
  this.userService.updateUser(this.userInfo).subscribe(
    {
    next:(res)=>
    {
      console.log("Password is completely changed")
      this.userPass.changePassword=""
      this.userPass.currentPassword=""
      this.userPass.retypePassoword=""
      $("#change-password-close-btn").click();
      swal({
        text:"Successfully Changed",
        icon:"success"
      })
    },
    error:(err)=>
    {
      this.status.changePassword.msg="Current Passoword is worng"
      this.status.changePassword.ok=true;
      this.userPass.changePassword=""
      this.userPass.currentPassword=""
      this.userPass.retypePassoword=""
      setTimeout(()=>this.status.changePassword.msg="",1000);
    }
    
  }
  )
}
else 
{
  this.userPass.changePassword=""
      this.userPass.currentPassword=""
      this.userPass.retypePassoword=""
  this.status.changePassword.ok=true;
  this.status.changePassword.msg="Password Not Match"  
  setTimeout(()=>this.status.changePassword.msg="",1000);
}

}

textImg(){
 this.userService.delteImage(this.userInfo).subscribe({
  next:(res)=>{
    console.log("It's work")
    console.log(res);
    console.log(res.data);
              this.user = res.data;
              this.userInfo={...this.user}                      
              this.userStore.saveUserData( res.data );
  },
  error:(err)=>{
              console.log(err)
  }
 })
}
}

