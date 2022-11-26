import { UserService } from 'src/app/model/service/http/user.service';
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Board } from "src/app/model/bean/board";
import { Notification } from "src/app/model/bean/notification";
import { User } from "src/app/model/bean/user";
import { BoardService } from "src/app/model/service/http/board.service";
import { SocketService } from "src/app/model/service/http/socket.service";
import { BoardStore } from "src/app/model/service/store/board.store";
import { UserStore } from "src/app/model/service/store/user.store";
import { Client } from "stompjs";
import swal from "sweetalert";
@Component({
    selector : 'noti',
    template : `
        <div (click)="handleGoBoardFromNoti(noti.board!.id)" id="noti" class="row py-2 m-0 d-flex justify-content-center align-items-center ps-3 pe-0 mb-1" [style.borderLeft]="borderLeft" >
           <div id="noti-icon-container" class="col-2 p-0" >
             <p id="icon" class="rounded-5 d-flex justify-content-center align-items-center " [style]="'width:48px;border:1px solid #424549;height:48px;'+'background:'+noti.board!.iconColor+';'" >
                <img *ngIf="noti.sentUser.imageUrl != null" class="rounded-5" style="width:48px;height:48px;object-fit:cover;" [src]="'http://localhost:8080/img/'+noti.sentUser.imageUrl"/>
                <span *ngIf="noti.sentUser.imageUrl == null" class="text-dark fs-5">{{ noti.sentUser.username[0].toUpperCase() }}</span>
             </p>
           </div>
           
           <div id="noti-body" class="col-10 ps-2 pe-1 text-justify " >
              <h6 *ngIf="!noti.invitiation" class="p-0 m-0 d-flex justify-content-between align-items-center" style="font-size:13px !important;letter-spacing:0.4px;line-height:1.3;">
              <span>{{  noti.content.length > 80 ? noti.content.substring(0,80)+'...' : noti.content }}</span>
            <span  [class.d-none]="isSeen()" style="font-size: 8px;" class="align-self-end"><i class="fa-solid fa-circle text-primary"></i></span>
            </h6>
              <h6 *ngIf="noti.invitiation" class="p-0 m-0 d-flex justify-content-between align-items-center" style="font-size:13px !important;letter-spacing:0.4px;line-height:1.3;">
              <span>
              {{  noti.content }}
              </span>
              
              <span [class.d-none]="isSeen()"   style="font-size: 8px; "class="align-self-end"><i class="fa-solid fa-circle text-primary"></i></span>
            </h6>
              <small style="font-size:10px;" class="text-primary">
              {{ noti.createdDate | pentaDate }}
              
            </small>
           </div>
        </div>
    `
})
export class NotiComponent implements OnInit {

    borderLeft : string = 'none !important';
    stompClient : Client | undefined = undefined;
    board : Board = new Board();
    @Input('noti') noti : Notification = new Notification();   
    constructor( private boardStore : BoardStore,
      private boardService : BoardService,
      private userStore : UserStore ,
      private socketService : SocketService,
       private router : Router,
       private userService:UserService){}

   ngOnInit(): void {
      if(this.noti.invitiation){
         this.borderLeft = `3px solid ${this.noti.board?.iconColor} !important`;
      }else{
         this.borderLeft = `3px solid none`;
      }
    }

    handleGoBoardFromNoti( boardId : number ){      
      // new
      this.noti.seenUsers.push(this.userStore.user);
      console.log("Noti seen user",this.noti.seenUsers)
      this.userService.seenNoti(this.noti,this.userStore.user.id).subscribe({
         next:(res)=>{
            console.log("It's work!")
            
            
         },error:(err)=>{
            console.log(err)
         }
      })
// new

      if(this.noti.invitiation==true)
      {  
        if(!this.boardStore.joinedBoards.some(board=> board.id == this.noti.board?.id))
        {
         swal({
            text : 'Are you sure to join this board?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
        }).then( isYes => {
         if(isYes){
            this.userStore.fetchUserData;
            this.boardService.joinBoard(this.userStore.user.email,this.noti.board?.code!,this.noti.board?.id!).subscribe({
               next:(res)=>{
                  if(res.ok){
                    
                     swal({
                        text : "Successfully Joined!",
                        icon : 'success'
                     }).then( () => {
                     this.boardStore.boards.push(this.noti.board!);
                     this.boardStore.joinedBoards.push(this.noti.board!);
                     this.socketService.sendNotiBackToInviter(this.noti.board! , this.noti.sentUser);
                     
                     this.socketService.subscribeBoard( this.noti.board?.id! )                                         
                     this.router.navigateByUrl(`/boards/${boardId}`);
                     this.noti.seenUsers.push(this.userStore.user);
               
                     })
                  }
               },
               error : err => {
                   swal({
                     text : 'Unable to Join!',
                     icon : 'warning'
                   })
               }
            })
            }
      })
        }else{
         this.router.navigateByUrl(`/boards/${boardId}`);
        }

      }else{
           
         if( window.location.href.includes(`/boards/${boardId}`)){         
            window.location.href = `/boards/${boardId}`;
          
                     
            return;
           }
           this.router.navigateByUrl(`/boards/${boardId}`);
           $('#noti-dropdown').click();
        }

   }
   
   isSeen() {
      return this.noti.seenUsers.some((res) => {            
            return res.id==this.userStore.user.id
      })
   }
   
}