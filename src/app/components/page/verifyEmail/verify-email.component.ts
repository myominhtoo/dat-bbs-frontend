import { Component , OnInit } from  "@angular/core";
import { UserService } from "src/app/model/service/http/user.service";

@Component({
    selector : 'verify-email',
    templateUrl:'./verify-email.component.html'
})
export class VerifyEmail implements OnInit{

    status = {
        hasError : false,
        isLoading : false,
        hasGotVerification : false
    }

    email ='';

    constructor(private userService : UserService ){}

    ngOnInit(): void {
        this.status.hasGotVerification = localStorage.getItem('hasGotVerification') == 'true' ? true : false;
    }

    onSubmit(){
       this.status.isLoading = true;
       this.userService.sendVerification( this.email).subscribe({
        next : (res) => {
            this.status.hasError = !res.ok;
            if( res.ok ) {
                this.status.hasGotVerification = true;
                localStorage.setItem('hasGotVerification',"true");
            }
            this.status.isLoading = false;
        }
       })
    }

    
}