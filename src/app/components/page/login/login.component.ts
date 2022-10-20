import { User } from './../../../model/bean/user';
import { UserService } from './../../../model/service/http/user.service';
import { Component, OnInit } from  "@angular/core";
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';
import { Router } from '@angular/router';


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
    constructor(private userService : UserService , private router : Router ){}
     
    ngOnInit(): void {
        let storeUser = localStorage.getItem(btoa('user'));
    }

    onSubmit(userForm:NgForm){
        this.userService.LoginUser(this.user).subscribe({
         next : (res) => {
            this.error = { hasError : false , msg : '' }
            localStorage.setItem(btoa('user'),btoa(JSON.stringify({id : res.data.id  , username : res.data.username , imageUrl : res.data.imageUrl})))
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
