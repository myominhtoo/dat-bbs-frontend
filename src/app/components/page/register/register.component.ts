import { Component } from  "@angular/core";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";

@Component({
    selector : 'register',
    templateUrl:'./register.component.html'
})
export class Register{
   
    user : User = new User ();
    constructor(private userService : UserService ){}

    onSubmit(){
        console.log(this.user)      
        // this.userService.sendRegisteration(this.user).subscribe({
        //     next : (res) => {
        //         console.log(res);
        //     }
        // })
    }
}