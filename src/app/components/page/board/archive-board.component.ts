import { Component, OnInit } from "@angular/core";
import { Board } from "src/app/model/bean/board";
import { User } from "src/app/model/bean/user";
import { BoardService } from "src/app/model/service/http/board.service";
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserStore } from "src/app/model/service/store/user.store";
import { BoardStore } from "src/app/model/service/store/board.store";
// import * as swal from "sweetalert";
import swal from "sweetalert";
import { SocketService } from "src/app/model/service/http/socket.service";
import { UserService } from "src/app/model/service/http/user.service";



@Component({
    selector :'archive-board',
    templateUrl : './archive-board.component.html'
})
export class ArchiveBoardComponent {

    user : User = new User();
    boards : Board[] = [];

    pdf='pdf';
    excel='excel';
    html='html';

    status = {
        isLoading : false,
        hasDoneFetching : false,
    }

    constructor(
        private boardService : BoardService ,
        public userStore : UserStore ,
        public boardStore : BoardStore ,
        private socketService : SocketService , 
        private userService : UserService   ){}


    restoreBoard(board : Board){
        this.boards=this.boards.filter( resBoard => resBoard.id!=board.id)
        board.deleteStatus = false;
        this.boardStore.ownBoards.push( board );
        this.socketService.subscribeBoard( board.id ); //subscribing restored baord
    }

    exportArchiveBoardReport(path:string) {

      let id=this.userStore.user.id;

        this.boardService.exportArchiveBoardReport(id,path).subscribe((res)=>{
            const blob = new Blob([res.body], { type : 'application/octet-stream'});
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = `archive-board.${path=='excel' ? 'xlsx' : path.toLowerCase()}`,
            a.click();
            URL.revokeObjectURL(objectUrl);
          swal({
            text : 'Successfully Exported!',
            icon : 'success'
        });
        })

    }

    unarchiveBoards( board : Board ){
        this.userStore.fetchUserData();
        const isMyBoard = board.user.id == this.userStore.user.id;
        this.userService.archiveBoard( this.userStore.user , board  )
        .subscribe( res => {
            if(res.ok){
                board.isArchive = false;
                this.boardStore.archivedBoards = this.boardStore.archivedBoards.filter( brd => brd.id != board.id );
                this.boardStore.boards.push( board );
                this.socketService.subscribeBoard( board.id );
                if( isMyBoard ){
                    this.boardStore.ownBoards.push(board);
                }else{
                    this.boardStore.joinedBoards.push( board );
                }
            }
        });
    }

}

