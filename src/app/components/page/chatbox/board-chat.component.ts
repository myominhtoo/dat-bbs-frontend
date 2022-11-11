import { UserStore } from './../../../model/service/store/user.store';
import { SocketService } from 'src/app/model/service/http/socket.service';
import { BoardMessage } from './../../../model/bean/BoardMessage';
import { Client } from 'stompjs';
import { Board } from './../../../model/bean/board';
import { BoardService } from './../../../model/service/http/board.service';
import { BoardStore } from 'src/app/model/service/store/board.store';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from './../../../model/service/http/user.service';
import { Component } from "@angular/core";
import * as Toastify from 'toastify-js';
import swal from "sweetalert";
@Component({
    selector:"board-chat",
    templateUrl:"./board-chat.component.html"
})

  

export class BoardChatComponent{
  
  public saveBoard=new Board();   
   public BoardMessage=new BoardMessage();  
   public messages:BoardMessage[]=[];
  //  public othermessages:BoardMessage[]=[]
    constructor(
      public userStore:UserStore,
        private UserService : UserService,
        private Router: Router,
        private socket:SocketService,
        public route : ActivatedRoute,
        public boardStore:BoardStore,
        public boaredService:BoardService
      ){
        document.title="BBMS | Chat"        
       let profileId=this.route.snapshot.params['id'];
       this.subscribeBoardsMessageSocket();
       if(profileId) this.getBoardWithBoardId(profileId);
       
       
      }


      
public getBoardWithBoardId(boardId:number){
  this.boaredService.getBoardWithBoardId(boardId).subscribe({
    next:(res)=>{        
        this.saveBoard=res;
        
    },
    error:(err)=>{
        console.log(err);
    }
})
}

sentMessage(message:string){
  if(this.BoardMessage.content!=""){
    this.BoardMessage.content=message
    this.BoardMessage.board=this.saveBoard;
    this.BoardMessage.user=this.userStore.user;
    this.socket.sentMeesageToGroupChat(this.saveBoard.id,this.BoardMessage)   
    this.BoardMessage.content=""
  }else{   
    console.log("not works")
  }
  
}

subscribeBoardsMessageSocket(){
  if(this.socket.stompClient){
    this.socket.stompClient.connect( {} ,
          () => {
              //subscribing boards channel
              this.boardStore.boards.forEach( board => {
                  this.socket.stompClient?.subscribe( `/boards/${board.id}/messages` , ( payload ) => {
                      const boardNoti = JSON.parse(payload.body) as BoardMessage;
                      this.messages.push(boardNoti);                                         
                      if( boardNoti.id != this.boardStore.userStore.user.id ){  
                         ($('#chat-noti')[0] as HTMLAudioElement).play();                          
                      }        
                  });       
              });
          }, 
          () => {
              swal({
                  text : 'Failed to connect to socket!',
                  icon : 'warning'
              });
          });
  }else{
      swal({
          text : 'Invalid Socket Connection!',
          icon : 'warning'
      });
  }
}




}
  

