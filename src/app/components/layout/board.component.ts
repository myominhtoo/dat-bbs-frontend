import { Component, Input, OnInit } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { BoardService } from "src/app/model/service/http/board.service";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { UserService } from "src/app/model/service/http/user.service";
import { BoardStore } from "src/app/model/service/store/board.store";

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

    constructor(
        private userService : UserService ,
        private taskCardService : TaskCardService,
        public boardStore : BoardStore ,
        private boardServie : BoardService
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



    removeBoard( e : Event ){
      e.stopPropagation();
      console.log('hi')
      this.data.deleteStatus = true;

      console.log(this.data)

      this.boardServie.updateBoard(this.data)
      .subscribe({
        next : res => {
          console.log(res )
        },
        error : err => {
          console.log(err)
        }
      });

        // this.boards=this.boardStore.boards;

        // this.ownerBoards= this.boards.filter((val)=>{
        //         return val.user.id==this.storeUser.id;
        // })
        // this.assignBoards=this.boards.filter((val)=>{
        //     return val.user.id!=this.storeUser.id;
        // })


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


}
