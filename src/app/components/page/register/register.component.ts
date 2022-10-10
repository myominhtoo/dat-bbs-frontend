import { NgForm } from '@angular/forms';
import { Component, OnInit } from  "@angular/core";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";

@Component({
    selector : 'register',
    templateUrl:'./register.component.html'
})
export class Register implements OnInit{
   
    user : User = new User ();
    constructor(private userService : UserService ){}

    ngOnInit(): void {
        let storedData = localStorage.getItem ( btoa ("data"))
        this.user.email= storedData ==null ? '' : JSON.parse( atob (`${storedData}`)).email;
    }
     
    onSubmit(){
        console.log(this.user)      
        // this.userService.sendRegisteration(this.user).subscribe({
        //     next : (res) => {
        //         console.log(res);
        //     }
        // })
    }
}