import { Component, Input, OnInit } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { TaskCardService } from "src/app/model/service/http/taskCard.service";
import { UserService } from "src/app/model/service/http/user.service";

@Component({
    selector : 'board',
    templateUrl : './board.component.html'
})
export class BoardComponent implements OnInit {

    @Input('data') data : Board = new Board();
    @Input('target') target : number = 0;

    constructor(
        private userService : UserService ,
        private taskCardService : TaskCardService
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
            this.data.members = members.map( member => member.user)
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
