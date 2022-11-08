import { UserService } from './../../model/service/http/user.service';
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/model/bean/user";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from 'src/app/model/service/store/user.store';
import swal from "sweetalert";
import * as SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';
import { BoardStore } from 'src/app/model/service/store/board.store';

@Component({
    selector : 'navbar',
    templateUrl:"./navbar.components.html",
})
export class NavbarComponent  implements OnInit {

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
    stompClient : Client | undefined;

    constructor( private toggleStore : ToggleStore , 
        public userStore : UserStore,
        public userService:UserService , 
        private boardStore : BoardStore  ){
            this.getUserData(this.storeUser.id);
            userStore.fetchUserData();
    }

    ngOnInit(): void {
      this.connectSocket();
    }

    b = true;

    connectSocket(){
      const socket = new SockJS( 'http://localhost:8080/socket' );
      this.stompClient = over( socket );
      this.stompClient.connect( {} , 
      () => {
        this.whenConnected();
      },
      () => {
        console.log('erro')
      });
    }

    whenConnected(){
      this.boardStore.boards.forEach( board => {
        this.stompClient?.subscribe( `/boards/${board.id}/notifications` , ( payload )  => {
          const data = JSON.parse(payload.body);
          console.log(data);  
        });  
      });
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
            this.userInfo={...resUser};
  
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