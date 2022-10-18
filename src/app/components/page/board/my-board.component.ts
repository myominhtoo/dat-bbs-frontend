import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Board } from "src/app/model/bean/board";
import { Stage } from "src/app/model/bean/stage";
import { TaskCard } from "src/app/model/bean/taskCard";
import { BoardService } from "src/app/model/service/http/board.service";
import { StageService } from "src/app/model/service/http/stage.service";
import { BoardStore } from "src/app/model/service/store/board.store";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import swal from 'sweetalert';

@Component({
    selector : 'my-board',
    templateUrl : './my-board.component.html'
})
export class MyBoardComponent implements OnInit {

    public stages : Stage [] = [];
    tasks : TaskCard [] = [];
    board : Board = new Board();
    email : string ='';
    emails :string[] =[];
    filterEmails : string [] = [];
    storedEmails : string [] = [];

    status = {
        isLoading : false,
        isAddStage : false,
        isAddingStage : false,
        isInviting : false,
        error : {
            email : {
                hasError : false,
                msg : ''
              }
        },
        update : {
            idx : 0,
            willUpdate : false
          }
    }
    // @Input('data') data : Stage = new Stage();

    constructor( public toggleStore : ToggleStore ,
         public route : ActivatedRoute ,
         private router : Router , 
         private stageService : StageService ,
         private boardService : BoardService  ){
            
         }

    ngOnInit(): void {
        this.doActionForCurrentBoard( this.route.snapshot.params['id'] );
    }

    /*
        getting stages for baord
    */
    async getStages( boardId : number ) : Promise<void>{
        this.stageService.getStagesForBoard( boardId )
        .subscribe({
            next : datas => {
                this.stages = datas;
            },
            error : err => {
                console.log(err);
                // window.history.back();
            }
        });
    }

    async getBoard( boardId : number ) : Promise<void> {
        this.boardService.getBoardWithBoardId( boardId )
        .subscribe({
            next : board => {
                this.status.isLoading = false;
                this.board = board;
            },
            error : err  => {
                // window.history.back();
            }
        })
    }

    doActionForCurrentBoard( boardId : any ){
      if( isNaN(boardId) ){
        /*
         will do if boardId is not a number 
         cuz we created boardId as a number
         to prevent manual entering to this page
        */
        window.history.back();
      }else{
        this.status.isLoading = true;
        this.getStages( boardId ).then(() => {
            this.getBoard( boardId );
        })
      }
    }

    toggleIsAddStage(){
        this.status.isAddStage = !this.status.isAddStage;
    }

    saveData(){
        this.board.invitedEmails=this.emails;
        this.status.isInviting = true;

        
        console.log(this.emails)
   
        swal({
            text : 'Are you sure to invite this members?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
          }).then( isYes => {
            if( isYes ){
                this.boardService.getBoardWithEmail(this.board.id, this.board)
              .subscribe({
                next : data => {
                  this.status.isInviting = false; 
                  swal({
                    text : 'successfully Invited !',
                    icon : 'success'
                  })
                },
                error : err => {
                  console.log(err);
                  this.status.isInviting =false;
                }
              });  
            }else{
              this.status.isInviting = false;
            }
          })
    }

    onChange( event : KeyboardEvent ){
       
        this.email  == ''
        ? this.filterEmails = []
        : this.filterAutoCompleteEmails( this.email);
  
  
        let email = this.email;
        let lastChar = email[email.length - 1];
        this.status.error.email = { hasError : false , msg : ''}
        if( lastChar === ',' || lastChar === ' ' ){
          let prevLastChar = email[email.length - 2];
    
          if( prevLastChar  == ' ' || prevLastChar == ','){
            this.email= prevLastChar == ' ' ? email.trim() : email.replaceAll(',','');
          }
          
          if(email.includes('@') && email.includes('.')){
            let storeEmail = email.includes(',') ? email.replaceAll(',','') : email.replaceAll(' ','');
            this.status.update.willUpdate
            ? this.emails[this.status.update.idx] = email
            : this.emails.includes(storeEmail)
             ? this.status.error.email = { hasError : true , msg : 'This email has already included!' }
             : this.emails.push( storeEmail );
    
            this.status.update = { idx : 0 , willUpdate : false }
            this.email = this.status.error.email.hasError ? this.email : '';
    
          }else{
    
            this.status.error.email = { hasError : true , msg : 'Invalid email!'}
            
          }
        }
      }
      filterAutoCompleteEmails(   filterEmail : string ){
        this.filterEmails =  this.storedEmails.filter(
          ( email )=>{
            return email.toLocaleLowerCase().includes( filterEmail.toLocaleLowerCase());
          }
        )
      }
      removeEmail( index : number ){
        if(!this.status.isLoading) this.emails.splice(index,1);
      }
      updateEmail( index : number ){
        this.email = this.emails [index];
        this.status.update = { idx : index , willUpdate : true }
        console.log(index)
      }

}