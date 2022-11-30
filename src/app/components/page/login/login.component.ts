
import { User } from './../../../model/bean/user';
import { UserService } from './../../../model/service/http/user.service';
import { Component } from  "@angular/core";
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { UserStore } from 'src/app/model/service/store/user.store';
import { BoardStore } from 'src/app/model/service/store/board.store';
import { NotificationStore } from 'src/app/model/service/store/notification.store';
import { AuthService } from 'src/app/model/service/http/auth.service';
import { SocketService } from 'src/app/model/service/http/socket.service';
import { COLORS } from 'src/app/model/constant/colors';


@Component({
    selector : 'login',
    templateUrl:'./login.component.html'
})
export class LoginComponent {
    togglepass!:boolean;
    status = {
        pwdNotMatch : '',
        
    }

    error = {
    hasError : false,
    msg : '',
    }

    user : User = new User ();
    constructor(private userService : UserService ,
        private router : Router , 
        public userStore : UserStore , 
        private authService : AuthService,
        public boardStore : BoardStore , 
        private notiStore : NotificationStore,
        private socketService : SocketService,        
        ){}
    
    ngOnInit(): void {
        let storeUser = localStorage.getItem(window.btoa(('user')));
        document.title = "BBMS | Login";
    }

    onSubmit(userForm:NgForm){
        this.userService.LoginUser(this.user).subscribe({
        next : (res) => {
                if(res.body.ok){
                        this.error = { hasError : false , msg : '' }
                        this.authService.saveToken(res.headers.get('Authorization')!)

                        this.userStore.saveUserData(res.body.data);
                        this.boardStore.refetchBoardsByUserId(res.body.data.id);
                        this.notiStore.reFetchNotis( res.body.data.id );   
                        this.socketService.unsubscribeAllChannels();                                             
                        setTimeout(() => {
                        this.socketService.subscribeNotis();
                        } , 1000 );
                        swal({
                            text : res.body.message,
                            icon : 'success',
                        }).then(() => {
                            this.router.navigateByUrl('/home');
                        })
                    }
                }, error : err => {
                    this.user.password = '';
                    this.error = { hasError : true , msg :err.error.message};
                }
            
            }
        )
    }
      togglePassword(){       
        this.togglepass=!this.togglepass;
     }
}
