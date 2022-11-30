import { BoardChatStore } from './../../../model/service/store/board-chat.store';
import { UserStore } from './../../../model/service/store/user.store';
import { SocketService } from 'src/app/model/service/http/socket.service';
import { BoardMessage } from './../../../model/bean/BoardMessage';
import { Board } from './../../../model/bean/board';
import { BoardService } from './../../../model/service/http/board.service';
import { BoardStore } from 'src/app/model/service/store/board.store';
import { ActivatedRoute } from '@angular/router';
import {  Component, OnInit, } from "@angular/core";
import swal from "sweetalert";
import { Location } from '@angular/common';
@Component({
    selector:"board-chat",
    templateUrl:"./board-chat.component.html"
})

  

export class BoardChatComponent implements OnInit{

  public profileId=Number(this.route.snapshot.params['id']);
  showEmojis: boolean = false;
  saveBoard=new Board();   
  BoardMessage=new BoardMessage();  
  messages:BoardMessage[]| undefined=[];
  status={
    messageLoad:false
  }  
  
    constructor(
      public userStore:UserStore,
        private socket:SocketService,
        public route : ActivatedRoute,
        public boardStore:BoardStore,        
        public boaredService:BoardService,
        public boardChatStore:BoardChatStore,
        private location : Location,
      ){
        this.status.messageLoad = false;
        document.title="BBMS | Chat"      
      }

    ngOnInit(): void {              
      this.BoardMessage.content=''
      this.scrollBottom();        
      this.getMessage(this.profileId);
       if(this.profileId) this.getBoardWithBoardId(this.profileId);    

    }  
    
   ngAfterViewChecked():void{
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
        this.showEmojis=false;
        this.scrollBottom()
        
        
        
        
        

      }else{   
        console.log("not works")
      }
      
    }

    scrollBottom(){
      let container=document.getElementById("chat-container");
      container?.scrollTo({
        top: container.scrollHeight,
        behavior:"smooth"
      })
    }

    getMessage(boardId:number){  
    this.socket.getBoardMessageList(boardId).subscribe({
      next:(res)=>{
        this.messages = res
        this.boardChatStore.boardMap.get(boardId)
        this.boardChatStore.boardMap.set(boardId, this.messages)
        console.log(this.boardChatStore.boardMap.get(boardId))
      },error:(err)=>{
      console.log(err)
      swal({
        text:"Fail To Fetch BoardMessage",
        icon:"fail"
      }
        
      )
      }
  })    
 
  
  }
  
     toggleEmojis() {
        this.showEmojis = !this.showEmojis;
    }

    addEmojiToComment(e: any) {
       this.BoardMessage.content += e.emoji.native;
    }

     backToBoard(){
        this.location.back();
    }

  }

