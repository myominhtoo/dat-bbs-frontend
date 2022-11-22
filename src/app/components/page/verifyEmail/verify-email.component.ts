import { NgForm } from '@angular/forms';
import { Component , OnInit } from  "@angular/core";
import { UserService } from "src/app/model/service/http/user.service";
import { encode } from 'src/app/util/encoder';

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
        this.status.hasGotVerification = localStorage.getItem('hasGotVerification') != null;
        document.title = "BBMS | Verify Email";
    }

    onSubmit(verifyemail:NgForm){
       this.status.isLoading = true;
       this.userService.sendVerification( verifyemail.value.email).subscribe({
        next : (res) => {
            this.status.hasError = !res.ok;
            if( res.ok ) {
                this.status.hasGotVerification = true;
                localStorage.setItem(encode('email'),encode(verifyemail.value.email));
                localStorage.setItem( 'hasGotVerification' , 'true' );
            }
            this.status.isLoading = false;
        },
        error : err => {
            this.status.hasError=true;
            this.status.isLoading = false;
        }
       })
    }


    backToSendVerification(){
        this.status.hasGotVerification = false;
        localStorage.removeItem('hasGotVerification');
    }

    ngOnDestroy(){
        this.status.hasGotVerification = false;
        localStorage.removeItem('hasGotVerification');
    }
    
}

