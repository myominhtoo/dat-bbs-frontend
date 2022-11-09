import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { BoardBookMark } from "src/app/model/bean/BoardBookMark";
import { BoardService } from "src/app/model/service/http/board.service";
import { BoardBookMarkService } from "src/app/model/service/http/boardBookmark.service";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { UserService } from "src/app/model/service/http/user.service";
import { BoardStore } from "src/app/model/service/store/board.store";
import { UserStore } from "src/app/model/service/store/user.store";
import swal from 'sweetalert';

@Component({
    selector : 'boardBookmark',
    templateUrl : './boardBookMark.component.html'
})
export class BoardBookmarkComponent implements OnInit {
    
    ngOnInit(): void {
        this.fetchRequiredDatas();
    }
    
    boards : Board [] = [];
    ownerBoards:Board[]=[];
    assignBoards:Board[]=[];

    storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`))));
    @Input('dataBookmark') dataBookmark : BoardBookMark = new BoardBookMark();
    // @Input('data') data : Board= new Board();

    @Input('target') target : number = 0;
    @Input('bookMarks') bookMarks :BoardBookMark[]=[];
    boardBookMark:BoardBookMark=new BoardBookMark();

    @Output('toggle-bookmark') toggleBookMarkEmit=new EventEmitter<BoardBookMark>();
    @Output('updateBoardDeleteStatus')  emitBoard = new EventEmitter<Board>();
    @Output('restore-board') emitRestoreBoard =new EventEmitter<Board>();

    constructor(
        private userService : UserService ,
        private taskCardService : TaskCardService,
        public boardStore : BoardStore ,
        private boardServie : BoardService,
        private boardBookmarkService : BoardBookMarkService,
        public usersStore : UserStore 
    ){    
        this.dataBookmark.board = new Board();
        this.dataBookmark.board.members = [];
        this.dataBookmark.board.tasks = [];
    }

    status = {
        isLoading : false,
    }

    fetchRequiredDatas(){
        this.getMembers( this.dataBookmark.board.id  )
        .then( () => {
            this.getCards( this.dataBookmark.board.id ).then( () => {
            });
        });
    }

    async getMembers( boardId : number ) : Promise<void> {
        this.userService.getUsersForBoard( boardId )
        .subscribe({
          next : members => {
             this.dataBookmark.board.members = members.map( d => d.members);
          },
          error : err => {
             console.log('error in getting members!'+err);
          }
         });
     }
 
 
     async getCards( boardId : number ) : Promise<void> {
         this.taskCardService.getTaskCards( boardId )
         .subscribe({
             next : tasks => {
                 this.dataBookmark.board.tasks =  tasks;
             },
             error : err => {
                 console.log('error in getting taskcards!'+err);
             }
         });
     }

     handleBookMark( e : Event,data:Board ){
        e.stopPropagation();
        this.boardBookMark.board=data;        
        this.boardBookMark.user=data.user;      
        const curBoardFromBookMarks = this.bookMarks.filter( bookMark => bookMark.board.id == this.dataBookmark.board.id );
        swal({
          text:curBoardFromBookMarks.length>0?"Are you sure to remove?":"Are you sure?",
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
                this.toggleBookMarkEmit.emit( res.data );
              }
            },error:(err)=>{
                console.log(err)
            }
        })              
          }
        })
    }

    isBookMark(){      
      return this.bookMarks.some((res)=>{      
            return res.board.id == this.dataBookmark.board.id;
      })          
    }

}