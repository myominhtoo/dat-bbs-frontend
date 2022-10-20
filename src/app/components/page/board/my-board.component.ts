import { Component , OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Board } from "src/app/model/bean/board";
import { Stage } from "src/app/model/bean/stage";
import { TaskCard } from "src/app/model/bean/taskCard";
import { BoardService } from "src/app/model/service/http/board.service";
import { StageService } from "src/app/model/service/http/stage.service";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import swal from 'sweetalert';
import $ from 'jquery'
import { TaskCardService } from "src/app/model/service/http/taskCard.service";

@Component({
    selector : 'my-board',
    templateUrl : './my-board.component.html'
})
export class MyBoardComponent implements OnInit {

    public stages : Stage [] = [];
    taskCardsMap : Map<string,TaskCard[]> = new Map();
    board : Board = new Board();

    email : string ='';
    emails :string[] =[];
    filterEmails : string [] = [];
    storedEmails : string [] = [];

    stage  : Stage = new Stage();

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
          },
        addingStageError : {
            hasError : false,
            msg : "",
        },
        addTaskError : '',
    }
    // @Input('data') data : Stage = new Stage();

    constructor( public toggleStore : ToggleStore ,
         public route : ActivatedRoute ,
         private router : Router , 
         private stageService : StageService ,
         private boardService : BoardService ,
         private taskCardService : TaskCardService ){
         }

    ngOnInit(): void {
        this.doActionForCurrentBoard( this.route.snapshot.params['id'] );
        this.stage.stageName = "";
        this.stage.defaultStatus = false;
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

                this.getTaskCards( boardId );
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
            this.getBoard( boardId )
        })
      }
    }

    toggleIsAddStage(){
        this.status.isAddStage = !this.status.isAddStage;
        this.status.addingStageError = { hasError : false , msg : '' };
    }

    handleAddStage(){
        this.stage.stageName === '' 
        ? this.status.addingStageError = { hasError : true , msg : 'Stage is Required!'}
        : this.status.addingStageError = { hasError : false , msg : ''};

        if( !this.status.addingStageError.hasError ){
            this.status.isAddingStage = true;
            
            this.stage.board  = this.board;

            this.stageService.createStage( this.stage )
            .subscribe({
                next : res => {
                    this.status.isAddingStage = false;
                   if( res.ok ){
                    this.stages.push( res.data );
                    this.taskCardsMap.set( res.data.stageName , [] );

                    this.status.isAddStage = false;
                    this.stage.stageName = "";
                   }else{
                    this.status.addingStageError = { hasError : true , msg : 'Duplicate Stage!'}
                   }
                },
                error : err => {
                    console.log(err);
                }
            })
        }
    }

    saveData(){
        this.board.invitedEmails=this.emails;
        this.status.isInviting = true;
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
                  }).then(() => {
                    this.emails = [];
                    this.email = "";
                    $("#invite-modal .btn-close").click();
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

  
    async getTaskCards( boardId : number ) : Promise<void>{
      this.taskCardService.getTaskCards( boardId )
      .subscribe({
        next : tasks => {
            this.createTaskCardsWithStageMap( this.stages ,  tasks );
        },
        error : err => {
          console.log(err);
        }
      });
    }

    createTaskCardsWithStageMap( stages : Stage[] , taskCards : TaskCard[] ){
       // need to create key with steage name
       stages.forEach( stage => {
        this.taskCardsMap.set( stage.stageName , [] );
       })
       
       taskCards.forEach( taskCard => {
         let prevTaskCards = this.taskCardsMap.get(taskCard.stage.stageName);
         prevTaskCards?.push(taskCard);
         this.taskCardsMap.set( taskCard.stage.stageName , prevTaskCards! );
       })
    }

    handleAddTask( taskCard : TaskCard ){
      let prevTasks = this.taskCardsMap.get(taskCard.stage.stageName);
      prevTasks?.push(taskCard);
      this.taskCardsMap.set( taskCard.stage.stageName , prevTasks! ); 
    }

}