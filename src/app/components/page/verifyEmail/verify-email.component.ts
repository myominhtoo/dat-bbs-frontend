import { Component } from  "@angular/core";
import { UserService } from "src/app/model/service/http/user.service";

@Component({
    selector : 'verify-email',
    templateUrl:'./verify-email.component.html'
})
export class VerifyEmail{
    email ='';
    constructor(private userService : UserService ){

    }
    onSubmit(){
       this.userService.sendVerification( this.email).subscribe({
        next : (res) => {
            console.log(res);
        }
       })
    }

    
}