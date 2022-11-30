import { tap } from 'rxjs';
import { UserStore } from 'src/app/model/service/store/user.store';
import { Component, OnInit } from  "@angular/core";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from 'sweetalert';
import { decode, encode } from 'src/app/util/encoder';
import { E } from 'chart.js/dist/chunks/helpers.core';
import { COLORS } from 'src/app/model/constant/colors';
import { HttpResponse } from 'src/app/model/bean/httpResponse';
import { AuthService } from 'src/app/model/service/http/auth.service';
import { SocketService } from 'src/app/model/service/http/socket.service';
import { BoardStore } from 'src/app/model/service/store/board.store';
import { NotificationStore } from 'src/app/model/service/store/notification.store';

@Component({
    selector : 'register',
    templateUrl:'./register.component.html'
})
export class RegisterComponent implements OnInit{

  
  emptyErrorMessage:String;
  togglepass!:boolean;
      user : User;
      username:string;
      email:string;
      password:string;
      code:string;
    status = {
      passValid: false,
      passRegister: true,
    };
    constructor(private userService : UserService,
      public route : ActivatedRoute ,
      public userStore : UserStore,
      private router:Router ,
      private authService : AuthService ,
      private socketService : SocketService ,
      private boardStore : BoardStore , 
      private notiStore : NotificationStore ){
    
     this.user=new User();
     this.emptyErrorMessage="";
     this.username="";
     this.email="";
     this.password="";
     this.code="";
    }

    ngOnInit(): void {
        let storedData = localStorage.getItem(encode('email'));
        //this.user.email= storedData ==null ? '' : decode(storedData);
        document.title = "BBMS | Register";
        const { email , code } = this.route.snapshot.queryParams;

        this.user.email= email;
        this.user.code=code;
    }


  onSubmit() {
      this.savedUser();    
  }

  savedUser() {
    if (this.user.password.length >= 6) {
      this.user.iconColor = COLORS[ Math.round(Math.random() * COLORS.length - 1)];
      this.userService.sendRegisteration(this.user).subscribe({
        next : res => {
          if( res.ok ){
            const resStatus  = res.body as HttpResponse<User>;
            console.log(resStatus)
            this.userStore.saveUserData( resStatus.data );
            this.authService.saveToken( res.headers.get('Authorization')!);
            this.boardStore.refetchBoardsByUserId( resStatus.data.id );
            this.notiStore.reFetchNotis( resStatus.data.id );
            this.socketService.unsubscribeAllChannels();

            setTimeout(() => {
              this.socketService.subscribeNotis();
            } , 1500 );

            localStorage.removeItem(btoa('data'));
            localStorage.removeItem('hasGotVerification');
            swal({
              text : resStatus.message,
              icon : 'success'
            }).then(() => {
              this.status.passValid=false
              this.router.navigateByUrl('/home');
            });
          }
        },
        error : err => {
          swal({
            text : err.error.message,
            icon : 'warning'
          })
        }
      })

    } else {
      swal({
            text : "Password must be at least 6 characters",
            icon : 'warning'
          })
    }
      
    }
 
     togglePassword(){       
        this.togglepass=!this.togglepass;
     }

}
