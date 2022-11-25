import { UserService } from './../../model/service/http/user.service';
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/model/bean/user";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from 'src/app/model/service/store/user.store';
import swal from "sweetalert";
import { NotificationStore } from 'src/app/model/service/store/notification.store';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/model/service/http/auth.service';
import { SocketService } from 'src/app/model/service/http/socket.service';
import { Notification } from 'src/app/model/bean/notification';
@Component({
    selector : 'navbar',
    templateUrl:"./navbar.components.html",
})
export class NavbarComponent implements OnInit {  
    userInfo:User=new User();
    userPass ={
        changePassword:"",
        currentPassword:"",
        retypePassoword:""
  }
    
      
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
        public userService:UserService , 
        public notificationStore : NotificationStore ,
        private authService : AuthService,
        private router : Router , 
        private socketService : SocketService ){
            userStore.fetchUserData();
            if( this.userStore.user.id ) this.getUserData(this.userStore.user.id )
    }

  ngOnInit(): void { 
    
    }

  
    toggleSidebar(){
        this.toggleStore.isShow=!this.toggleStore.isShow;
        let show=this.toggleStore.isShowSubject.value;
        this.toggleStore.isShowSubject.next(!show);
    }

    getUserData( userId : number ){
        this.userService.getUser( userId )
        .subscribe({
          next : resUser => {
            this.userInfo = {...resUser};
  
          },
          error : err => {
            console.log(err);
          }
        });
      }
  

    changePassword(){
      if(this.userPass.changePassword ==this.userPass.retypePassoword){
        this.userInfo.password=this.userPass.changePassword;
        this.userInfo.confirmpassword=this.userPass.currentPassword;
        this.userService.updateUser(this.userInfo).subscribe(
          {
          next:(res)=>
          {
            if( res.ok ){
              
              this.userStore.saveUserData( res.body.data );
              this.authService.saveToken( res.headers.get('Authorization')! );

              this.userPass.changePassword = "";
              this.userPass.currentPassword = "";
              this.userPass.retypePassoword = "";
              $("#change-password-close-btn").click();

              swal({
                text:"Successfully Changed",
                icon:"success"
              })
            }
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
  
    handleLogout(){
      swal({
        text : 'Are you sure to logout?',
        icon : 'warning',
        buttons : [ 'No' , 'Yes' ]
      }).then( isYes => {
        if(isYes){
          localStorage.removeItem(window.btoa('user'));   
          localStorage.removeItem(window.btoa('token'));   
          this.socketService.unsubscribeAllChannels();
          this.router.navigateByUrl('/login');
        }
      });
  }
  

    

}