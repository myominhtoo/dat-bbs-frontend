import { NgForm } from '@angular/forms';
import { Component , OnInit } from  "@angular/core";
import { UserService } from "src/app/model/service/http/user.service";

@Component({
    selector : 'verify-email',
    templateUrl:'./verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit{

    status = {
        hasError : false,
        isLoading : false,
        hasGotVerification : false
    }


    constructor(private userService : UserService ){}

    ngOnInit(): void {
        let storedData = localStorage.getItem(btoa('data'));
        this.status.hasGotVerification = storedData ==  null ? false : JSON.parse(atob(`${storedData}`)).hasGotVerification;


    }

    onSubmit(verifyemail:NgForm){
       this.status.isLoading = true;
       this.userService.sendVerification( verifyemail.value.email).subscribe({
        next : (res) => {
            this.status.hasError = !res.ok;
            if( res.ok ) {
                this.status.hasGotVerification = true;
                localStorage.setItem(btoa('data'),btoa(JSON.stringify({ hasGotVerification : true , email : verifyemail.value.email })));
            }
            this.status.isLoading = false;
        },
        error : err => {
            this.status.hasError=true;
            console.log('error')
            this.status.isLoading = false;
        }
       })
    }

}
