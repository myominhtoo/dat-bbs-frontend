import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Board } from "src/app/model/bean/board";
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
  userStore: any;

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

    }

     @Output('updateBoardDeleteStatus')  emitBoard = new EventEmitter<Board>();

     removeBoard( e : Event ){
      e.stopPropagation();
      console.log('hi')
      this.data.deleteStatus = true;

      // console.log(this.data)

      swal({
        text : 'Are you sure to delete board?',
        icon : 'warning',
        buttons : [ 'No' , 'Yes' ]
      }).then(isYes=>{

        if( isYes ){
          this.boardServie.updateBoard(this.data)
          .subscribe({
            next : res => {
              // console.log(res )
            this.emitBoard.emit(this.data)
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


    handleBookMark( e : Event ){
        e.stopPropagation();
    }

    restoreBoard(e : Event){
      this.data.deleteStatus=false;
      swal({
        text : 'Are You Sure to Restore ?',
        icon : 'warning',
        buttons : ['No' , 'Yes']
      }).then(isYes=>
        {
          if(isYes){
            this.boardServie.updateBoard(this.data).subscribe({
              next : res => {
                this.emitBoard.emit(this.data)
              },
              error : err =>{
                console.log(err)
              }
            });
          }
        }) 
    }
}
