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
import {  AfterViewChecked, Component, OnInit, } from "@angular/core";
import swal from "sweetalert";

@Component({
    selector:"board-chat",
    templateUrl:"./board-chat.component.html"
})

  

export class BoardChatComponent implements OnInit{
  profileId=this.route.snapshot.params['id'];

  saveBoard=new Board();   
  BoardMessage=new BoardMessage();  
  messages:BoardMessage[]=[];
  status={
    messageLoad:false
   }  
    constructor(
      public userStore:UserStore,
        private socket:SocketService,
        public route : ActivatedRoute,
        public boardStore:BoardStore,
        public boaredService:BoardService
      ){
        this.status.messageLoad = false;
        document.title="BBMS | Chat"      
      }

    ngOnInit(): void {
        this.scrollBottom();
        this.subscribeBoardsMessageSocket();            
        this.getBoardMessage(this.profileId)      
       if(this.profileId) this.getBoardWithBoardId(this.profileId);    
    }
    // ngafterviewinit
    
    ngAfterViewChecked(): void {                                   
      // this.scrollBottom();            
   }
   ngAfterContentChecked():void{
      this.scrollBottom();            
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
        this.getBoardMessage(this.profileId);
      }else{   
        console.log("not works")
      }
      
    }

    subscribeBoardsMessageSocket(){
  
      if(this.socket.stompClient){
        this.socket.stompClient.connect( {} ,
              () => {
                console.log("it's working")
                  //subscribing boards channel
                  this.boardStore.boards.forEach( board => {
                      this.socket.stompClient?.subscribe( `/boards/${board.id}/messages` , ( payload ) => {
                        
                          const boardNoti = JSON.parse(payload.body) as BoardMessage;
                          this.messages.push(boardNoti);                                     
                          if( boardNoti.id != this.boardStore.userStore.user.id ){  
                              console.log("It's work! and working");
                              this.getBoardMessage(this.profileId);
                            ($('#chat-noti')[0] as HTMLAudioElement).play();                              
                            this.scrollBottom()
                            
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


    scrollBottom(){
      let container=document.getElementById("chat-container");
      container?.scrollTo({
        top: container.scrollHeight,
        behavior:"smooth"
      })
    }

    getBoardMessage(id:number){
      
      this.socket.getBoardMessageList(id).subscribe({
        next:(res)=>{          
          this.messages=res;

        },error:(err)=>{
          console.log(err)
        }
      })   
    }
}
  


