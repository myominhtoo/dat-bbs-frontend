import { Component, OnInit } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { BoardService } from "src/app/model/service/http/board.service";
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { filter, map } from "rxjs";

@Component({
    selector :'create-board',
    templateUrl : './create-board.component.html'
})
export class CreateBoardComponent implements OnInit {

    constructor( public toggleStore : ToggleStore , 
      private boardService :BoardService ,
      private router : Router ,
      private userService : UserService ){}

    emailStr :string ='';
    emails : string [] = [];  

    board : Board = new Board();
    
    /*
      for auto fill
    */
    storedEmails : string [] = [];


    status = {
      update : {
        idx : 0,
        willUpdate : false
      },
      error : {
          boardName : {
            hasError : false,
            msg : '',
          },
          description : {
            hasError : false,
            msg : ''
          },
        email : {
          hasError : false,
          msg : ''
        }
      },
      isLoading : false,
    }

    ngOnInit(): void {
      this.getAllUsers();
    }
  
    onChange( event : KeyboardEvent ){
      let emailStr = this.emailStr; // this ko ma thone chin loh
      let lastChar = emailStr[emailStr.length - 1];
      this.status.error.email = { hasError : false , msg : ''}
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
           ? this.status.error.email = { hasError : true , msg : 'This email has already included!' }
           : this.emails.push( storeEmail );
  
          this.status.update = { idx : 0 , willUpdate : false }
          this.emailStr = this.status.error.email.hasError ? this.emailStr : '';
  
        }else{
  
          this.status.error.email = { hasError : true , msg : 'Invalid email!'}
          
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
      user.id = 1;
      this.board.user = user;
      this.board.invitedEmails = this.emails;
      this.status.isLoading = true;


      this.board.boardName == null || this.board.boardName == ''
      ? this.status.error.boardName = { hasError : true , msg : 'Board Name is required!'}
      : this.status.error.boardName = { hasError : false , msg : '' };

      this.board.description == null || this.board.description == ''
      ? this.status.error.description = { hasError : true , msg : 'Description is required!'}
      : this.status.error.description = { hasError : false , msg : '' };

      
      if( !this.status.error.boardName.hasError && !this.status.error.description.hasError ){
        this.boardService.createBoard(this.board)
        .subscribe({
          next : data => {
            this.status.isLoading = false;
            console.log(data);
            alert("Succesfully Created!");
          },
          error : err => {
            console.log(err);
            this.board.boardName = '';
            this.board.description = '';
          }
        });
  
      }
  }

  getAllUsers(){
    const users$ = this.userService.getUsers();
    users$.pipe(
      map( resUsers => {
        return resUsers.map( user => {
          return user.email;
        })
      }),
    ).subscribe({
      next : resEmails => {
        this.storedEmails = resEmails;
      },
      error : err => {
        console.log(err);
      }
    });
  }

}

