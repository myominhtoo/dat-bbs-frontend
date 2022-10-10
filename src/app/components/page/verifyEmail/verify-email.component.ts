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
        let storedData = localStorage.getItem(btoa('data'));
        this.status.hasGotVerification = storedData ==  null ? false : JSON.parse(atob(`${storedData}`)).hasGotVerification;

        
    }

    onSubmit(){
       this.status.isLoading = true;
       this.userService.sendVerification( this.email).subscribe({
        next : (res) => {
            this.status.hasError = !res.ok;
            if( res.ok ) {
                this.status.hasGotVerification = true;
                localStorage.setItem(btoa('data'),btoa(JSON.stringify({ hasGotVerification : true , email : this.email })));
            }
            this.status.isLoading = false;
        }
       })
    }
    
}