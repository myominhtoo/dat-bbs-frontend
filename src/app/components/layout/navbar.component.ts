import { UserService } from './../../model/service/http/user.service';
import { Subject, Observable } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/model/bean/user";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from 'src/app/model/service/store/user.store';
import swal from "sweetalert";
@Component({
    selector : 'navbar',
    templateUrl:"./navbar.components.html",
})
export class NavbarComponent{
    user : User = new User();
    userInfo:User=new User();
    userPass={
        changePassword:"",
        currentPassword:"",
        retypePassoword:""
      }
      storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`))));

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

    constructor( private toggleStore : ToggleStore , 
        public userStore : UserStore,
        public userService:UserService ){
            this.getUserData(this.storeUser.id);
            userStore.fetchUserData();
        }

    b = true;

    toggleSidebar(){
        this.toggleStore.isShow=!this.toggleStore.isShow;
        let show=this.toggleStore.isShowSubject.value;
        this.toggleStore.isShowSubject.next(!show);
    }

    getUserData( userId : number ){
        this.userService.getUser( userId )
        .subscribe({
          next : resUser => {
            this.userInfo={...resUser};
  
          },
          error : err => {
            console.log(err);
          }
        });
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
  
    

}