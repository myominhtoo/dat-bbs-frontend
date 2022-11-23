import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { UserStore } from "src/app/model/service/store/user.store";
import swal from 'sweetalert';
@Component({
    selector :'forget-password',
    templateUrl : './forget-password.component.html'
})
export class ForgetPasswordComponent implements OnInit {

    ngOnInit(): void {
       this.user.email='';
       this.user.code = '';
       this.user.password = '';
       this.user.confirmpassword = '';
    }
    constructor(
      private userService : UserService,
      private router : Router , 
      public userStore : UserStore ){
        document.title = "BBMS | forget-password"
      }
    

    user : User = new User;

    status = {
        isEmailLoading : false,
        sendEmail : false ,
        isLoading : false,
        // isConfirm : false,
        hasError : false
    }

    sendCode(email : string){
        this.status.isEmailLoading=true;
        this.userService.forgetPassword(email).subscribe({
            next : (res) => {
               swal({
                text : 'Successfully Sent! , Check Your Email!',
                icon : 'success'
              })
              this.status.isEmailLoading = false;
              this.status.sendEmail = true;
            },
            error: err =>{
              swal({
                text : err.error.message,
                icon : 'warning'
              })
              this.status.isEmailLoading=false;
            }
        })
    }

    forgetPasswordConfirm(forgetPassword:NgForm){

       if( this.user.password == '' || this.user.code == '' || this.user.confirmpassword == '' ){
        this.status.hasError = true; 
        return;
       }
       
       this.status.hasError = false;

        if ( this.user.password == this.user.confirmpassword){
          swal({
            text : 'Are you sure to reset your password?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
          }).then(isYes => {
            if( isYes ){
              this.status.isLoading=true;
              this.userService.changePassword(this.user).subscribe({
                next : (res)=>{
                  if(res.ok){
                    swal({
                      text : 'Successfully Changed!',
                      icon : 'success'
                    }).then(() => {
                      this.router.navigateByUrl('/login');
                      })
                      this.status.isLoading=false;                
                  }
                },
                error : err=>{
                    swal({
                      text : 'Codes are not matched!',
                      icon : 'warning'
                    })
                    this.status.isLoading=false;
                }
              })
            }
          })
         }else{
          swal ({
            text : 'Two passwords must be match!',
            icon : 'warning'
          })
        
        }
      }
}

