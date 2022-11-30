import { Component, OnInit } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { BoardService } from "src/app/model/service/http/board.service";
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { map } from "rxjs";
import { BoardStore } from "src/app/model/service/store/board.store";
import { UserStore } from "src/app/model/service/store/user.store";
import { SocketService } from "src/app/model/service/http/socket.service";
import { COLORS } from "src/app/model/constant/colors";

@Component({
    selector :'create-board',
    templateUrl : './create-board.component.html'
})
export class CreateBoardComponent implements OnInit {

    constructor( public toggleStore : ToggleStore ,
      private boardService :BoardService ,
      private router : Router ,
      private userService : UserService ,
      public userStore : UserStore,
      public boardStore : BoardStore ,
      private socketService : SocketService ){}

    emailStr :string ='';
    emails : string [] = [];

    board : Board = new Board();
    debounceInput!: Function;

    /*
      for auto fill
    */
    storedEmails : string [] = [];
    filterEmails : string [] = [];
    registeredUsers : User [] = [];

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
      document.title = "BBMS | Create Board";

    }

    onChange( event : KeyboardEvent ){

      this.emailStr  == ''
      ? this.filterEmails = []
      : this.filterAutoCompleteEmails( this.emailStr);

      let emailStr = this.emailStr; // this ko ma thone chin loh
      let lastChar = emailStr[emailStr.length - 1];
      this.status.error.email = { hasError : false , msg : ''}
      if( lastChar === ',' || lastChar === ' ' ){
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
      if(!this.status.isLoading) this.emails.splice(idx,1);
    }

    setUpdateEmail( idx : number ){
      this.emailStr = this.emails[idx];
      this.status.update = { idx : idx , willUpdate : true }
    }

    createBoard(){

      if( this.emails.length == 0 && this.emailStr.includes('@') && this.emailStr.includes('.')  ) this.emails.push(this.emailStr);

      this.userStore.fetchUserData();
      this.board.user = this.userStore.user;
      this.board.invitedEmails = this.emails;

      this.board.boardName == null || this.board.boardName == ''
      ? this.status.error.boardName = { hasError : true , msg : 'Board Name is required!'}
      : this.status.error.boardName = { hasError : false , msg : '' };
      
      if( this.board.boardName.length > 30 ){
        this.status.error.boardName = { hasError : true , msg : 'Must not include more then 30 characters!'};
        return;
      }else{
        this.status.error.boardName = { hasError : false , msg : ''};
      }

      if( !this.status.error.boardName.hasError ){
        swal({
          text : 'Are you sure to create board?',
          icon : 'warning',
          buttons : [ 'No' , 'Yes' ]
        }).then( isYes => {
          if( isYes ){
            this.status.isLoading = true;
            this.board.invitedEmails = this.board.invitedEmails.filter( email => email != this.userStore.user.email );

            /*
             for board's icon color
            */
           this.board.iconColor = COLORS[ Math.floor( Math.random() * (COLORS.length - 1) ) ];

            this.boardService.createBoard(this.board)
            .subscribe({
              next : resCreateBoard => {
                this.status.isLoading = false;
                /*
                 for internal app invitiation noti
                */
               if( resCreateBoard.ok ){
                  const createdBoard = resCreateBoard.data;

                  const invitedUsers = this.registeredUsers.filter( user => this.board.invitedEmails.includes(user.email));
                  this.socketService.sendBoardInvitiationNotiToUsers( createdBoard , invitedUsers );

                  createdBoard.archivedUsers = [];// edited for nullable

                  this.boardStore.boards.push( createdBoard );
                  this.boardStore.ownBoards.push( createdBoard );

                  swal({
                    text : resCreateBoard.message,
                    icon : 'success'
                  }).then( () => {
                    this.router.navigateByUrl('/boards');
                  })
               }
              },
              error : err => {
                this.status.isLoading = false;
                console.log(err);
                this.board.boardName = '';
                this.board.description = '';
              }
            });
          }else{
            this.status.isLoading = false;
          }
        })
      }
  }

    getAllUsers(){
      const users$ = this.userService.getUsers();
      users$.pipe(
        map( resUsers => {
          return resUsers.filter( user => {
            return user.id != this.userStore.user.id;
          }).map( filteredUser => {
            this.registeredUsers.push(filteredUser);
            return filteredUser.email;
          })
        })
      ).subscribe({
        next : resEmails => {
          this.storedEmails = resEmails;
        },
        error : err => {
          console.log(err);
        }
      });
    }

    filterAutoCompleteEmails( filterEmail : string ){
      this.filterEmails =  this.storedEmails.filter(
        ( email )=>{
          return email.toLocaleLowerCase().includes( filterEmail.toLocaleLowerCase());
        }
      )
    }

}

