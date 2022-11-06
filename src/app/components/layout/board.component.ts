
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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

  storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`))));
    @Input('data') data : Board = new Board();
    @Input('target') target : number = 0;
    @Input('bookMark') bookMark :BoardBookMark[]=[];
  userStore: any;
  boardBookMark:BoardBookMark=new BoardBookMark();
  // BoardBookMarkList:BoardBookMark[]=[];
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
      this.isBookMark();      
        this.fetchRequiredDatas();

    }
      @Output('bookmarkEmit') bookmarkEmit=new EventEmitter<BoardBookMark[]>();
     @Output('updateBoardDeleteStatus')  emitBoard = new EventEmitter<Board>();
     @Output('restore-board') emitRestoreBoard =new EventEmitter<Board>();

     removeBoard( e : Event ){
      e.stopPropagation();
<<<<<<< HEAD
      this.data.deleteStatus = true;
=======
      //console.log('hi')
      
>>>>>>> 210752975830e85f025046df8ed1061aab5bb218

      // console.log(this.data)

      swal({
        text : 'Are you sure to delete board?',
        icon : 'warning',
        buttons : [ 'No' , 'Yes' ]
      }).then(isYes=>{

        if( isYes ){
          this.data.deleteStatus = true;
          this.boardServie.updateBoard(this.data)
          .subscribe({
            next : res => {
<<<<<<< HEAD
    
            this.emitBoard.emit(this.data)
=======
              // console.log(res )
            this.emitBoard.emit(this.data);
            
>>>>>>> 210752975830e85f025046df8ed1061aab5bb218
            },
            error : err => {
              console.log(err)
            }
          });
        }

    })
    }



    fetchRequiredDatas(){
        this.getMembers( this.data.id  )
        .then( () => {
            this.getCards( this.data.id ).then( () => {
                // console.log('hi')
            });
        });
    }

    async getMembers( boardId : number ) : Promise<void> {
       this.userService.getUsersForBoard( boardId )
       .subscribe({
         next : members => {
            this.data.members = members.map( d => d.members);
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
                this.data.tasks =  tasks;
            },
            error : err => {
                console.log('error in getting taskcards!'+err);
            }
        });
    }


    handleBookMark( e : Event,data:Board ){
        e.stopPropagation();
        
        for(let i=0;i<this.bookMark.length;i++){
          console.log("works")
          if(this.bookMark[i].id==data.id){
            console.log("delete book mark is work")
            this.boardBookMark.board=data;        
            this.boardBookMark.id=this.bookMark[i].id;
            this.boardBookMark.user=data.user;                  
          this.userService.toggleBookMark(data.user.id,this.boardBookMark).subscribe({
            next:(res)=>{          
              // console.log("It's work outer",res)
              this.userService.getBookMark(data.user.id).subscribe({
                next:(res)=>{
                  // console.log("It's work inner",res)
                    this.bookmarkEmit.emit(res);
                },error:(err)=>{
                console.log(err)
                }
              })
            },error:(err)=>{
                console.log(err)
            }
          })        
          }else{
            console.log("create book mark is work")
            this.boardBookMark.board=data;                    
            this.boardBookMark.user=data.user;      
            
          this.userService.toggleBookMark(data.user.id,this.boardBookMark).subscribe({
            next:(res)=>{          
              // console.log("It's work outer",res)
              this.userService.getBookMark(data.user.id).subscribe({
                next:(res)=>{
                  // console.log("It's work inner",res)
                    this.bookmarkEmit.emit(res);
                },error:(err)=>{
                console.log(err)
                }
              })
            },error:(err)=>{
                console.log(err)
            }
          })        

          }
        }
        
        
    }
    isBookMark(){      
    return this.bookMark.some((res)=>{      
          return res.id==this.data.id
    })          
    
    }

    restoreBoard(e : Event){
      e.stopPropagation();
      // this.data.deleteStatus=false;
      swal({
        text : 'Are You Sure to Restore ?',
        icon : 'warning',
        buttons : ['No' , 'Yes']
      }).then(isYes=>
        {
          if(isYes){
            this.data.deleteStatus=false;
            this.boardServie.updateBoard(this.data).subscribe({
              next : res => {
                this.emitRestoreBoard.emit(this.data);
              },
              error : err =>{
                console.log(err)
              }
            });
          }
        }) 
    }
}
