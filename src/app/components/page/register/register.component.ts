import { NgForm } from '@angular/forms';
import { Component, OnInit } from  "@angular/core";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { Router } from "@angular/router";
import swal from 'sweetalert';

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


    onSubmit(){
      this.savedUser();
    }

    savedUser(){
      this.userService.sendRegisteration(this.user).subscribe({
        next : res => {
          if( res.ok ){
            localStorage.removeItem(btoa('data'));
            swal({
              text : res.message,
              icon : 'success'
            }).then(() => {
              this.router.navigateByUrl('/login');
            });
          }
        },
        error : err => {
          swal({
            text : err.error.message,
            icon : 'warning'
          });
        }
      })

    }
}
