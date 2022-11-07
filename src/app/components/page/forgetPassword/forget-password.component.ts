import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
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
      
    }
    constructor(private userService : UserService,
                public userStore : UserStore ){}
    

    user : User = new User;

    status = {
        isEmailLoading : false,
        sendEmail : false ,
        isLoading : false,
        // isConfirm : false,
    }

    sendCode(email : string){
        this.status.isEmailLoading=true;
        this.status.sendEmail=false;
        this.userService.forgetPassword(email).subscribe({
            next : (res) => {
               swal({
                text : 'Successfully!',
                icon : 'success'
              })
              this.status.isEmailLoading=false;
              this.status.sendEmail=true;
            },
            error: err =>{
              this.status.isEmailLoading=false;
            }
        })
    }

    forgetPasswordConfirm(forgetPassword:NgForm){
        
        if ( this.user.password == this.user.confirmpassword){
          // this.status.isConfirm=true;
          this.status.isLoading=true;
          this.status.sendEmail=false;
          swal({
            text : 'Are you sure to reset your password?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
          }).then(isYes => {
            this.userService.changePassword(this.user).subscribe({
              next : (res)=>{
                if(res.ok){
                  swal({
                    text : 'Successfully Changed!',
                    icon : 'success'
                  })
                  this.status.isLoading=false;
                }
              },
              error : err=>{
                  swal({
                    text : 'Failed to reset password!',
                    icon : 'error'
                  })
              }
            })
          })
         }else{
          swal ({
            text : 'passwords are not matched!',
            icon : 'warning'
          })
        
        }
      
        }
}

