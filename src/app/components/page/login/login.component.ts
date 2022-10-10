import { User } from './../../../model/bean/user';
import { UserService } from './../../../model/service/http/user.service';
import { Component, OnInit } from  "@angular/core";
import { UnsubscriptionError } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
    selector : 'login',
    templateUrl:'./login.component.html'
})
export class Login{
    
    user : User = new User ();
    constructor(private userService : UserService ){}

    onSubmit(userForm:NgForm){
        this.user.password=userForm.value.password;
        this.user.email=userForm.value.email;
        console.log(this.user)
        this.userService.LoginUser(this.user).subscribe({
         next : (res) => {
                    console.log(res);
                    console.log("It working ")
                    
                    
         }, error : err => {
            console.log('error')
            console.log(err)
            
        }
        })
        
     }
}