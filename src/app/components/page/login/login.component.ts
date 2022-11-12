import { User } from './../../../model/bean/user';
import { UserService } from './../../../model/service/http/user.service';
import { Component } from  "@angular/core";
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { UserStore } from 'src/app/model/service/store/user.store';
import { BoardStore } from 'src/app/model/service/store/board.store';
import { NotificationStore } from 'src/app/model/service/store/notification.store';


@Component({
    selector : 'login',
    templateUrl:'./login.component.html'
})
export class LoginComponent {

    status = {
        pwdNotMatch : ''
    }

    error = {
       hasError : false,
       msg : '',
    }

    user : User = new User ();
    constructor(private userService : UserService ,
         private router : Router , 
         private userStore : UserStore , 
         public boardStore : BoardStore , 
         private notiStore : NotificationStore  ){}
     
    ngOnInit(): void {
        let storeUser = localStorage.getItem(window.btoa(('user')));
        document.title = "BBMS | Login";
    }

    onSubmit(userForm:NgForm){
        this.userService.LoginUser(this.user).subscribe({
         next : (res) => {
            this.error = { hasError : false , msg : '' }
            this.userStore.saveUserData(res.data);
            this.boardStore.refetchBoardsByUserId(res.data.id);
            this.notiStore.reFetchNotis( res.data.id );
            swal({
                text : res.message,
                icon : 'success',
            }).then(() => {
                this.router.navigateByUrl('/home');
            })
         }, error : err => {
            this.user.password = '';
           this.error = { hasError : true , msg :err.error.message};
         }
            
        }
        )
     }
}
