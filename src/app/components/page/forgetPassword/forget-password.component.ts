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
      hasError: false,
      toggleconfirmpass: false,
      togglepass:false,
      passNew: false,
      passCon: false,
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
 
  

  if(this.user.password == this.user.confirmpassword  ) {
       if (this.user.password.length >= 7) {
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
       } else {
          swal ({
            text : 'Passwords must be at least 7 characters',
            icon : 'warning'
          })
         }
         }else{
          swal ({
            text : 'Two passwords must be match!',
            icon : 'warning'
          })
        
        }
  }
  togglePassword() {
    this.status.togglepass=!this.status.togglepass
  }
  toggleConPassword() {
    this.status.toggleconfirmpass = !this.status.toggleconfirmpass;
  }
    
  validPassword(pass: string) {

    if (pass.length  == 0) {
      this.status.passNew = false
    } else if (pass.length  >= 7) {
      this.status.passNew=false
    } else {
      this.status.passNew=true
      
    }
  }
  validConPassword(pass: string) {
    if (pass.length  == 0) {
      this.status.passCon=false
    } else if (pass.length  >= 7) {
      this.status.passCon=false
    } else {
      this.status.passCon=true
    }
  }
}

