import { NgForm } from '@angular/forms';
import { Component, OnInit } from  "@angular/core";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { Router } from "@angular/router";

@Component({
    selector : 'register',
    templateUrl:'./register.component.html'
})
export class RegisterComponent implements OnInit{


  emptyErrorMessage:String;

    user : User;
    username:string;
    email:string;
    password:string;
    code:string;

    constructor(private userService : UserService ,private router:Router){

     this.user=new User();
     this.emptyErrorMessage="";
     this.username="";
     this.email="";
     this.password="";
     this.code="";
    }

    ngOnInit(): void {
        let storedData = localStorage.getItem ( btoa ("data"))

        this.user.email= storedData ==null ? '' : JSON.parse( atob (`${storedData}`)).email;
    }

    onSubmit( registerForm : NgForm){
      this.userService.sendRegisteration(this.user).subscribe(data=>{
        this.router.navigateByUrl('/login');
    });

  }
}
