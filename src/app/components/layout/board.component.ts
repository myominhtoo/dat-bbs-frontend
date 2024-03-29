
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { forkJoin } from "rxjs";
import { Board } from "src/app/model/bean/board";
import { BoardBookMark } from "src/app/model/bean/BoardBookMark";
import { BoardService } from "src/app/model/service/http/board.service";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { UserService } from "src/app/model/service/http/user.service";
import { BoardStore } from "src/app/model/service/store/board.store";
import { UserStore } from "src/app/model/service/store/user.store";
import swal from 'sweetalert';


@Component({
    selector : 'board',
    templateUrl : './board.component.html'
})
export class BoardComponent implements OnInit {

    boards : Board [] = [];
    ownerBoards:Board[]=[];
    assignBoards:Board[]=[];



    @Input('data') data : Board = new Board();
    @Input('target') target : number = 0;
    @Input('bookMarks') bookMarks :BoardBookMark[]=[];
    boardBookMark:BoardBookMark=new BoardBookMark();

    @Output('toggle-bookmark') toggleBookMarkEmit=new EventEmitter<BoardBookMark>();
    @Output('updateBoardDeleteStatus')  emitBoard = new EventEmitter<Board>();
    @Output('restore-board') emitRestoreBoard =new EventEmitter<Board>();
    @Output('archive') archiveBoardEmit = new EventEmitter<Board>();
    @Output('unarchive') unarchiveBoardEmit = new EventEmitter<Board>();


    constructor(
        private userService : UserService ,
        private taskCardService : TaskCardService,
        public boardStore : BoardStore ,
        private boardServie : BoardService,
        public usersStore : UserStore
    ){
        this.data.members = [];
        this.data.tasks = [];
    }

    status = {
        isLoading : false,
    }

    ngOnInit(): void {
      this.fetchRequiredDatas();
        this.isBoardArchive();
    }

     removeBoard( e : Event ){
      e.stopPropagation();

      swal({
        text : 'Are you sure to delete this board?',
        icon : 'warning',
        buttons : [ 'No' , 'Yes' ]
      }).then(isYes=>{

        if( isYes ){
          this.data.deleteStatus = true;
          this.boardServie.updateBoard(this.data)
          .subscribe({
            next : res => {
            this.emitBoard.emit(this.data);
            },
            error : err => {
              console.log(err)
            }
          });
        }

    })
    }

    fetchRequiredDatas(){
       forkJoin([
        this.userService.getUsersForBoard(this.data.id),
        this.taskCardService.getTaskCards(this.data.id)
       ]).subscribe( ([ boardHasUsers , taskCards ]) => {
          this.data.members = boardHasUsers.map( boardHasUser => boardHasUser.members );
          this.data.tasks = taskCards;
       });

    }

    handleBookMark( e : Event,data:Board ){
          e.stopPropagation();
          if( !this.data.isArchive ){
                this.usersStore.fetchUserData();

                this.boardBookMark.board = data;
                this.boardBookMark.user = this.usersStore.user;

                  //getting current board form book marks
                  const curBoardFromBookMarks = this.bookMarks.filter( bookMark => bookMark.board.id == data.id );

                // will enter if cur board has been book mark
                  swal({
                    text:curBoardFromBookMarks.length > 0 ? "Are you sure to remove?" : "Are you sure to bookmark?",
                    icon:"warning",
                    buttons : [ 'No' , 'Yes' ]
                  }).then(isYes=>{
                    if(isYes){
                      if( curBoardFromBookMarks.length > 0 ){
                        this.boardBookMark.id = curBoardFromBookMarks[0].id;
                      }
                      this.userService.toggleBookMark(data.user.id,this.boardBookMark).subscribe({
                      next:(res)=>{
                        if(res.ok){
                          console.log(res.data)
                          this.toggleBookMarkEmit.emit( res.data );
                        }
                      },error:(err)=>{
                          console.log(err)
                      }
                  })
                }
              })
          }
    }

    isBookMark(){
      return this.bookMarks.some((res)=>{
            return res.board.id == this.data.id
      })
    }

    // restoreBoard(e : Event){
    //   e.stopPropagation();
    //   // this.data.deleteStatus=false;
    //   swal({
    //     text : 'Are you sure to restore board?',
    //     icon : 'warning',
    //     buttons : ['No' , 'Yes']
    //   }).then(isYes=>
    //     {
    //       if(isYes){
    //         this.data.deleteStatus=false;
    //         this.boardServie.updateBoard(this.data).subscribe({
    //           next : res => {
    //             this.emitRestoreBoard.emit(this.data);
    //             this.data.deleteStatus=false;
    //           },
    //           error : err =>{
    //             console.log(err)
    //           }
    //         });
    //       }
    //       // this.data.deleteStatus=true;
    //     })
    // }

    handleClickMenu( event : Event ){
      event.stopPropagation();

      $(`#board-dropdown${this.data.id} .dropdown-menu`).toggle();
    }

    archiveBoard( event : Event ){
      event.stopPropagation();
      swal({
        text : 'Are you sure to archive this board?',
        icon : 'warning',
        buttons : [ 'No' , 'Yes' ]
      }).then( isYes => {
        if(isYes){
          this.usersStore.fetchUserData();
          this.data.archivedUsers.push(this.usersStore.user);
          this.archiveBoardEmit.emit( this.data );
        }else{
          $(`#board-dropdown${this.data.id} .dropdown-menu`).hide();
        }
      })
    }

    unarchiveBoard(){
      swal({
        text : 'Are you sure to unarchive this board?',
        icon : 'warning',
        buttons : [ 'No' , 'Yes' ]
      }).then( isYes => {
        if(isYes){
          this.usersStore.fetchUserData();
          this.data.archivedUsers = this.data.archivedUsers.filter( user => this.usersStore.user.id != user.id );
          this.unarchiveBoardEmit.emit( this.data );
        }else{
          $(`#board-dropdown${this.data.id} .dropdown-menu`).hide();
        }
      })
    }

    isBoardArchive(){
      this.data.isArchive =  this.boardStore.archivedBoards.some( board => board.id == this.data.id );
    }

    leaveFromCurrentBoard( event : Event ){
      event.stopPropagation();
      swal({
        text : 'Are you sure to leave from this board?',
        icon : 'warning',
        buttons : [ 'No' , 'Yes' ]
      }).then( isYes => {
        if(isYes){
          this.boardStore.leaveBoard( this.data );
        }
        $(`#board-dropdown${this.data.id} #dropdown-btn`).click();
      });
    }


    // deleteBoard(event : Event){
    //   event.stopPropagation();

    //   swal({
    //     text : 'Are you sure to delete this board?',
    //     icon : 'warning',
    //     buttons : [ 'No' , 'Yes' ]
    //   }).then( isYes => {
    //     if(isYes){
    //       this.boardServie.updateDeleteStatus(this.data.id,this.data).subscribe(datts=>{

    //         console.log(datts);


    //         $(`#board-dropdown${this.data.id} #dropdown-btn`).click();

    //       })


    //     }

    //   });
    // }



      }




