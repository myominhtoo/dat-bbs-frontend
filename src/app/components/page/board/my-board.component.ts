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
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { ChangeStageType } from "src/app/model/types/custom-types";
import { CommentService } from "src/app/model/service/http/comment.service";
import { Comment } from "src/app/model/bean/comment";
import { User } from "src/app/model/bean/user";
import { BoardsHasUsers } from 'src/app/model/bean/BoardsHasUser';
import { UserStore } from 'src/app/model/service/store/user.store';
import { SocketService } from 'src/app/model/service/http/socket.service';
import { Notification } from 'src/app/model/bean/notification';
import { COLORS } from "src/app/model/constant/colors";
import { BoardTasksStore } from "src/app/model/service/store/board-tasks.store";
import { BoardStore } from "src/app/model/service/store/board.store";

@Component({
    selector : 'my-board',
    templateUrl : './my-board.component.html'
})
export class MyBoardComponent implements OnInit {

    pdf='pdf';
    excel='excel';
    html='html';

    path:string="";


    errorTaskCard:TaskCard []=[];

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
    boardId : number | undefined;

    registeredUsers : User [] = [];

    stage  : Stage = new Stage();

    msg:String="";
    click:boolean=false;

    offCanvasTask : TaskCard = new TaskCard();
    offCanvasTab : string = "";
    // activities : Activity [] = [];
    // comments : Comment [] = [];

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
         private router : Router ,
         private stageService : StageService ,
         private boardService : BoardService ,
         private taskCardService : TaskCardService,
         private commentService : CommentService,
         private userService :UserService ,
         public userStore : UserStore ,
         public socketService : SocketService ,
         private boardTasksStore : BoardTasksStore , 
         private boardStore : BoardStore  ){
          this.offCanvasTask.activities = [];
          this.offCanvasTask.comments = [];
          this.board.user = new User();
    }

    ngOnInit(): void {
        //listening route
        this.handleRouteChange();

        this.getUsers();
        this.boardId = this.route.snapshot.params['id'];
        this.doActionForCurrentBoard(  this.boardId );
        this.stage.stageName = "";
        this.stage.defaultStatus = false;
        document.title = "BBMS | My Board";
    }

    getRelationContainers( me : Stage ){
      return this.stages.filter( stage => {
        return stage.id != me.id;
      }).map( filterStage => {
        return `${filterStage.id}`;
      })
    }

    getUserMembers(){
      this.userService.getUsersForBoard(this.route.snapshot.params['id']).subscribe(data=>{
            this.boardsHasUsers = data.filter( d => d.user.username != null )
                                  .map( boardHasUser => {
                                    return { ...boardHasUser , iconColor : COLORS[ Math.floor( Math.random() *  (COLORS.length - 1) )] }
                                  });
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
                this.boardTasksStore.board  = board; // for calendar
                this.getTaskCards( boardId );
            },
            error : err  => {
                // window.history.back();
            }
        })
    }

    getUsers(){
      this.userService.getUsers()
      .subscribe({
        next : resUsers => {
          this.registeredUsers = resUsers;

          this.storedEmails = resUsers.filter( user => user.id != this.userStore.user.id )
                              .map( filteredUser => filteredUser.email );
        },
        error : err => {
          console.log(err);
        }
      })
    }

    doActionForCurrentBoard( boardId : any ){
      if( isNaN(boardId)  ){
        /*
         will do if boardId is not a number
         cuz we created boardId as a number
         to prevent manual entering to this page
        */
        window.history.back();
      }else{
        this.status.isLoading = true;
        this.getStages( boardId ).then(() => {
            this.userStore.fetchUserData();
            this.getBoards( this.userStore.user.id )
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

                    const container = ($('#main-area')[0] as HTMLDivElement);
                    container.scrollTo ({
                      left : container.scrollLeft + 200
                    })

                    this.stages.push( res.data );
                    this.taskCardsMap.set( res.data.id.toString() , [] );

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
        this.board.invitedEmails = this.emails;

        /*
          not to invite member again
        */
       

        if( this.emails.length > 0 || this.email.length > 5 ){
          swal({
            text : 'Are you sure to invite this emails?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
          }).then( isYes => {
            if( isYes ){
              this.status.isInviting = true;

              this.boardService.inviteMembersToBoard(this.board.id, this.board)
              .subscribe({
                next : data => {
                  this.status.isInviting = false;

                  if( !this.members.some( member => this.board.invitedEmails.includes(member.email)) ){
                    const invitedUsers = this.registeredUsers.filter( user => this.board.invitedEmails.includes(user.email) );
                    this.socketService.sendBoardInvitiationNotiToUsers( this.board , invitedUsers );

                    const noti = new Notification();
                    noti.content = `${this.userStore.user.username} invited new members in ${this.board.boardName} Board `;
                    noti.sentUser = this.userStore.user;
                    noti.board = this.board;

                    this.socketService.sentNotiToBoard( this.board.id , noti);
                  }

                  swal({
                    text : 'Successfully Invited !',
                    icon : 'success'
                  }).then(() => {
                    this.emails = [];
                    this.email = "";
                    this.getUserMembers();
                    $("#invite-modal .btn-close").click();
                  })
                },
                error : err => {
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
      filterAutoCompleteEmails(  filterEmail : string ){
        console.log(filterEmail);
        this.filterEmails =  this.storedEmails.filter(
          ( email )=>{
            return email.toLocaleLowerCase().includes( filterEmail.toLocaleLowerCase());
          }
        )
        console.log(this.filterEmails)
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
            this.boardTasksStore.taskCards = tasks;
            this.boardTasksStore.hasGotData = true;
        },
        error : err => {
          console.log(err);
        }
      });
    }

    createTaskCardsWithStageMap( stages : Stage[] , taskCards : TaskCard[] ){
       // need to create key with steage name
       stages.forEach( stage => {
        this.taskCardsMap.set( stage.id.toString() , [] );
       })
       taskCards.forEach( taskCard => {
         let prevTaskCards = this.taskCardsMap.get(taskCard.stage.id.toString());
         prevTaskCards?.push(taskCard);
         this.taskCardsMap.set( taskCard.stage.id.toString() , prevTaskCards! );
       })
    }

    handleAddTask( taskCard : TaskCard ){
      let prevTasks = this.taskCardsMap.get(taskCard.stage.id.toString());
      prevTasks?.push(taskCard);

      //for calendar view
      if( taskCard.stage.id != 3 ){
        this.boardTasksStore.taskCards.push( taskCard);
      }

      this.taskCardsMap.set( taskCard.stage.stageName.toString(), prevTasks! );
    }

    handleChangeStage( payload : ChangeStageType ){
       let prevStage = payload.task.stage.stageName;
       let targetStage = this.stages.filter( stage => {
        return payload.stageTo == stage.id;
       })[0];

       payload.task.stage = targetStage; //setting updated stage to task

       //will remove done stage task from calendar
       if( payload.task.stage.id == 3 ){
        this.boardTasksStore.taskCards = this.boardTasksStore.taskCards.filter( task => task.id != payload.task.id );
       }else{
        // if stage is not done stage , will check and push into calendar tasks
         if( !this.boardTasksStore.taskCards.some( task => payload.task.id  == task.id )){
          this.boardTasksStore.taskCards.push( payload.task );
         }
       }

       this.taskCardService.updateTaskCard( payload.task )
       .subscribe({
        next : res => {
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

    getBoards( userId : number ){
      this.boardService.getBoardsForUser( userId )
      .subscribe({
        next : boards => {
          const isMyBoard = boards.some( board => board.id == this.boardId );
          if( !isMyBoard ){
            window.history.back();
          }
        },
        error : err => {
          console.log(err);
        }
      })
    }


    handleShowOffCanvas( task  : TaskCard ){
      $('#task-offcanvas-btn').click();
      this.offCanvasTask = task;
      this.offCanvasTab = 'activity';
    }

    handleShowCommentSectionInOffCanvas( task : TaskCard ){
      this.handleShowOffCanvas(task);
      this.offCanvasTab = 'comment';
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

                   if( this.board.user.id == this.userStore.user.id  ){
                     this.boardStore.ownBoards = this.boardStore.ownBoards.map( board => {
                       if( board.id == res.data.id ) return res.data;
                       return board;
                     })
                   }else{
                    this.boardStore.joinedBoards = this.boardStore.joinedBoards.map( board => {
                      if( board.id == res.data.id ) return res.data;
                      return board;
                    })
                   }

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
    if(this.taskCardsMap.get(stg.id.toString())?.length==0){
      this.stageService.deleteStage(stg.id).subscribe( res =>{
          if( res.ok ){
            swal({
              text : res.message,
              icon : 'success'
            })
          }
      }) ;
      this.stages=this.stages.filter(stage=>stage.id != stg.id);
    }else{
      swal({
        text : 'Unable to delete this stage!',
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

  exportMemberReport(path:string) {
    let boardId = this.route.snapshot.params['id'];
    this.userService.exportMember(boardId,path).subscribe((res) => {
      const blob = new Blob([res.body], { type : 'application/octet-stream'});
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `members.${path=='excel' ? 'xlsx' : path.toLowerCase()}`,
      a.click();
      URL.revokeObjectURL(objectUrl);
      swal({
        text : 'Successfully Exported!',
        icon : 'success'
    });
    })
  }

   exportTaskReport(path:string ) {

    let boardId = this.route.snapshot.params['id'];

      this.taskCardService.getTaskCards(boardId).subscribe(data=>{

        this.errorTaskCard=data;
        if(this.errorTaskCard.length==0){

          swal({
            text : 'TaskCard is not avaliable!',
            icon : 'warning'
        });
        }
        else{
          this.taskCardService.exportTaskReport(boardId,path).subscribe((res)=>{
            const blob = new Blob([res.body], { type : 'application/octet-stream'});
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = `taskCards.${path=='excel' ? 'xlsx' : path.toLowerCase()}`,
            a.click();
            URL.revokeObjectURL(objectUrl);

            swal({
                text : 'Successfully Exported!',
                icon : 'success'
            });
        })

        }


      })

 }

}
