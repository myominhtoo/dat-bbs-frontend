import { Component } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { BoardService } from "src/app/model/service/http/board.service";
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { User } from "src/app/model/bean/user";

@Component({
    selector :'create-board',
    templateUrl : './create-board.component.html'
})
export class CreateBoardComponent{

    constructor( public toggleStore : ToggleStore , private boardService :BoardService ,private router : Router ){}

    emailStr :string ='';
    emails : string [] = [];
    error = {
      hasError : false,
      msg : '',
   }

    board : Board = new Board();
  
    status = {
      update : {
        idx : 0,
        willUpdate : false
      },
      error : {
        hasError : false,
        msg : ''
      }
    }
  
    onChange( event : KeyboardEvent ){
      let emailStr = this.emailStr; // this ko ma thone chin loh
      let lastChar = emailStr[emailStr.length - 1];
      this.status.error = { hasError : false , msg : ''}
      if( lastChar === ',' || lastChar === ' ' || event.keyCode == 13 ){
        // previous char before last char
        let prevLastChar = emailStr[emailStr.length - 2];
  
        if( prevLastChar  == ' ' || prevLastChar == ','){
          this.emailStr = prevLastChar == ' ' ? emailStr.trim() : emailStr.replaceAll(',','');
        }
        
        if(emailStr.includes('@') && emailStr.includes('.')){
          let storeEmail = emailStr.includes(',') ? emailStr.replaceAll(',','') : emailStr.replaceAll(' ','');
          this.status.update.willUpdate
          ? this.emails[this.status.update.idx] = emailStr
          : this.emails.includes(storeEmail)
           ? this.status.error = { hasError : true , msg : 'This email has already included!' }
           : this.emails.push( storeEmail );
  
          this.status.update = { idx : 0 , willUpdate : false }
          this.emailStr = this.status.error.hasError ? this.emailStr : '';
  
        }else{
  
          this.status.error = { hasError : true , msg : 'Invalid email!'}
          
        }
      }
    } 
    removeEmail( idx : number ){
      this.emails.splice(idx,1);
    }
  
    setUpdateEmail( idx : number ){
      this.emailStr = this.emails[idx];
      this.status.update = { idx : idx , willUpdate : true }
    }
  
    createBoard(){
      const user = new User();
      user.id = 7;
      this.board.user = user;
      this.board.invitedEmails = this.emails;
      this.boardService.createBoard(this.board)
      // .subscribe({
      //   next : ( res ) => {
      //     if (res.ok){
      //   console.log(res);
      //     alert("Succesfully Created!");
      //     }
      //   }
      // })
      .subscribe(data =>{
        console.log(data);
        alert("Succesfully Created!");
      }
      );
  }

}
