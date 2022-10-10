import { Component, OnInit } from  "@angular/core";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { Router } from "@angular/router";

@Component({
    selector : 'register',
    templateUrl:'./register.component.html'
})
export class Register implements OnInit{


  emptyErrorMessage:String;

    user : User;
    username:string;
    email:string;
    password:string;
    code:string;

    constructor(private userService : UserService ,private rouetr:Router){

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
        console.log(this.user)
        // this.userService.sendRegisteration(this.user).subscribe({
        //     next : (res) => {
        //         console.log(res);
        //     }
        // })

        if(this.user.username==null || this.user.email == null || this.user.password == null || this.user.code == null ||
          this.user.username=="" || this.user.email == "" || this.user.password == "" ){

            this.emptyErrorMessage="Please Fill the blank";

            if(this.user.username==null || this.user.username=="")
              this.username="Name is Required";
            if(this.user.email==null || this.user.email=="")
              this.email="Email is Required";
              if(this.user.password==null || this.user.password=="")
              this.password="Password is Required";
              if(this.user.code==null)
              this.code="Code is Required";
          }else{
            this.savedUser();
          }
    }

    savedUser(){
      this.userService.sendRegisteration(this.user).subscribe(data=>{
        console.log(data);
      })
    }
}
