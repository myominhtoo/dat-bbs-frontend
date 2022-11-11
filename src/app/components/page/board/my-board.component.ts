import { BoardStore } from 'src/app/model/service/store/board.store';
import { Component ,  OnInit } from "@angular/core";
import { ActivatedRoute , NavigationEnd, Router } from "@angular/router";
import { Board } from "src/app/model/bean/board";
import { Stage } from "src/app/model/bean/stage";
import { TaskCard } from "src/app/model/bean/taskCard";
import { BoardService } from "src/app/model/service/http/board.service";
import { StageService } from "src/app/model/service/http/stage.service";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserService } from "src/app/model/service/http/user.service";
import swal from 'sweetalert';
import $ from 'jquery'
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { ChangeStageType } from "src/app/model/types/custom-types";
import { ActivityService } from "src/app/model/service/http/activity.service";
import { Activity } from "src/app/model/bean/activity";
import { CommentService } from "src/app/model/service/http/comment.service";
import { Comment } from "src/app/model/bean/comment";
import { User } from "src/app/model/bean/user";
import { BoardsHasUsers } from 'src/app/model/bean/BoardsHasUser';
import { UserStore } from 'src/app/model/service/store/user.store';
import { SocketService } from 'src/app/model/service/http/socket.service';
import { Notification } from 'src/app/model/bean/notification';

@Component({
    selector : 'my-board',
    templateUrl : './my-board.component.html'
})
export class MyBoardComponent implements OnInit {

    boardsHasUsers : BoardsHasUsers [] = [];
    members : User [] = [];
    public stages : Stage [] = [];
    taskCardsMap : Map<string,TaskCard[]> = new Map();
    board : Board = new Board();
    comment : Comment = new Comment();
    email : string ='';
    emails :string[] =[];
    filterEmails : string [] = [];
    storedEmails : string [] = [];
    tempComment : string ='';
    showEmojis : boolean = false;

    stage  : Stage = new Stage();

    offCanvasTask : TaskCard = new TaskCard();
    activities : Activity [] = [];
    comments : Comment [] = [];

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
        addBoardError : '',
        isLoadingOffcanvas : false,
        isEditBoardName : false,
        tempBoardName : ''
    }

    constructor( public toggleStore : ToggleStore ,
         public route : ActivatedRoute ,
         public boardStore:BoardStore,
         private router : Router ,
         private stageService : StageService ,
         private boardService : BoardService ,
         private taskCardService : TaskCardService,
         private activityService : ActivityService ,
         private commentService : CommentService,
         private userService :UserService ,
         public userStore : UserStore ,
         public socketService : SocketService  ){
          this.board.user = new User();

         }

    ngOnInit(): void {
      //listening route
      this.handleRouteChange();

        this.doActionForCurrentBoard( this.route.snapshot.params['id'] );
        this.stage.stageName = "";
        this.stage.defaultStatus = false;
        document.title = "BBMS | My Board";

    }

    getRelationContainers( me : Stage ){
      return this.stages.filter( stage => {
        return stage.id != me.id;
      }).map( filterStage => {
        return `${filterStage.stageName}`;
      })
    }

    getUserMembers(){
      this.userService.getUsersForBoard(this.route.snapshot.params['id']).subscribe(data=>{
            this.boardsHasUsers = data.filter( d => d.user.username != null );
            this.members = data.map( d => d.user ).filter( user => user.username != null );
      });
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
            this.getBoard( boardId );
            this.getUserMembers();
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

                    const noti = new Notification();
                    noti.content =  `${this.userStore.user.username.toLocaleUpperCase()} created New Stage in ${this.board.boardName} Board!`;
                    noti.sentUser = this.userStore.user;
                    noti.board = this.board;
                    this.socketService.sentNotiToBoard( this.board.id , noti );

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

    inviteMembers(){
        if( this.emails.length == 0 && this.email.length > 5 ) this.emails.push(this.email);
        this.board.invitedEmails=this.emails;
        if( this.emails.length > 0 || this.email.length > 5 ){
          swal({
            text : 'Are you sure to invite this members?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
          }).then( isYes => {
            if( isYes ){
              this.status.isInviting = true;
              this.boardService.inviteMembersToBoard(this.board.id, this.board)
              .subscribe({
                next : data => {
                  this.status.isInviting = false;
                  swal({
                    text : 'Successfully Invited !',
                    icon : 'success'
                  }).then(() => {
                    this.emails = [];
                    this.email = "";
                    this.getUserMembers();
                    $("#invite-modal .btn-close").click();

                    const noti = new Notification();
                    noti.content = `${this.userStore.user.username} invited new members in ${this.board.boardName} Board `;
                    noti.sentUser = this.userStore.user;
                    noti.board = this.board;

                    this.socketService.sentNotiToBoard( this.board.id , noti);

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
        }else{
          $("#invite-modal .btn-close").click();
        }
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

    handleChangeStage( payload : ChangeStageType ){
       let prevStage = payload.task.stage.stageName;
       let targetStage = this.stages.filter( stage => {
        return payload.stageTo === stage.stageName;
       })[0];
      //  console.log(payload.task)
      //  console.log(payload.task.stage)
      //  console.log(targetStage);
       payload.task.stage = targetStage; //setting updated stage to task

       this.taskCardService.updateTaskCard( payload.task )
       .subscribe({
        next : res => {
          // let prevTasks = this.taskCardsMap.get( payload.stageTo );

          // it is also ok without following cuz of line 271
          // this.taskCardsMap.set( payload.stageTo , prevTasks?.map( task => {
          //   if( task.id ===  res.data.id ){
          //      return res.data;
          //   }
          //   return task;
          // })! );
          const noti = new Notification();
          noti.content = `${this.userStore.user.username} changed ${payload.task.taskName} Task's stage \n  from '${prevStage}' to '${targetStage.stageName}' in ${this.board.boardName} Board `;
          noti.sentUser = this.userStore.user;
          noti.board = this.board;

          this.socketService.sentNotiToBoard( this.board.id , noti);
        },
        error : err => {
          console.log(err);
        }
       });
    }

    getActivitiesForTaskCard( taskCardId : number ){
      this.activityService.getActivities( taskCardId )
      .subscribe({
        next : resActivities => {
          this.activities = resActivities;
        },
        error : err => {
          console.log(err);
        }
      });
    }

    getCommentsForTaskCard( taskCardId : number ){
      this.commentService.getComments( taskCardId )
      .subscribe({
        next : resComments => {
          this.status.isLoadingOffcanvas = false;
          this.comments = resComments;
        },
        error : err => {
          console.log(err);
        }
      })
    }

    handleShowOffCanvas( task  : TaskCard ){
      $('#task-offcanvas-btn').click();

      this.offCanvasTask = task;
      this.status.isLoadingOffcanvas = true;

      this.getActivitiesForTaskCard( task.id );
      this.getCommentsForTaskCard( task.id );
    }

    handleRouteChange(){
      this.router.events.subscribe( e => {
        if( e instanceof NavigationEnd ){
          if( e.url.includes('/boards')){
            let boardId = this.route.snapshot.params['id'];
            this.doActionForCurrentBoard( boardId );
            this.stage.stageName = "";
            this.stage.defaultStatus = false;
            this.getUserMembers();
          }
        }
      })
    }

    handleUpdateBoardName( e : KeyboardEvent ){
      const input = e.target as HTMLInputElement;
      this.status.addBoardError = '';
      if( e.key === "Escape" ){
        this.status.isEditBoardName= false;
        this.board.boardName=this.status.tempBoardName;
        input.blur();
      }
      if( e.key === 'Enter' ){
           this.boardService.updateBoard( this.board )
           .subscribe({
               next : res => {
                   this.board = res.data;

                   this.status.isEditBoardName=false;
                   input.blur();
               },
               error : err => {
                   this.status.addBoardError = err.error.message;
               }
           });

      }


   }

   setupEditBoard(){
    this.status.isEditBoardName=true;
    this.status.tempBoardName=this.board.boardName;
   }

   handleDeleteStage( stg : Stage ){
    if(this.taskCardsMap.get(stg.stageName)?.length==0){
      // swal({
      //   text : 'Deleted SuccessFully!',
      //   icon : 'success'
      // }).then(()=>{
           this.stageService.deleteStage(stg.id).subscribe(data=>{
               }) ;
           this.stages=this.stages.filter(stage=>stage.id != stg.id);
      // })
    }else{
      swal({
        text : 'Fail to Deleted!',
        icon : 'warning'
      })
      }
   }

   setupUpdateComment( cmt : Comment ){
     this.comment = cmt;
     this.tempComment=this.comment.comment;
     this.commentService.updateComment(this.comment).subscribe({
       next : res =>{
          cmt=res.data;
          this.showEmojis = false;
          $("#cmt-modal .btn-close").click();
       },
       error : err =>{
        console.log(err);
       }
     })
   }

   handleCancel(){
    $("#cmt-modal .btn-close").click();
    this.comment.comment=this.tempComment;
   }

   toggleEmojis(){
    this.showEmojis = !this.showEmojis;
   }
   
   addEmojiToComment( event : any ){
    this.comment.comment += event.emoji.native;
   }

}
