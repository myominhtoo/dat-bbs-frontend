import { UserStore } from 'src/app/model/service/store/user.store';
import { Component, OnInit } from  "@angular/core";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import swal from 'sweetalert';
import { decode, encode } from 'src/app/util/encoder';

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

    constructor(private userService : UserService,
      public route : ActivatedRoute ,
      public userStore : UserStore,
      private router:Router){

     this.user=new User();
     this.emptyErrorMessage="";
     this.username="";
     this.email="";
     this.password="";
     this.code="";
    }

    ngOnInit(): void {
        let storedData = localStorage.getItem(encode('email'));
        //this.user.email= storedData ==null ? '' : decode(storedData);
        document.title = "BBMS | Register";
        const { email , code } = this.route.snapshot.queryParams;
        console.log(email,code);
        this.user.email= email;
        this.user.code=code;
    }


    onSubmit(){
      this.savedUser();
    }

    savedUser(){
      this.userService.sendRegisteration(this.user).subscribe({
        next : res => {
          if( res.ok ){
            localStorage.removeItem(btoa('data'));
            localStorage.removeItem('hasGotVerification');
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
          })
        }
      })

    }
  
}
