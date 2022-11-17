import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Notification } from "src/app/model/bean/notification";
import { BoardStore } from "src/app/model/service/store/board.store";

@Component({
    selector : 'noti',
    template : `
        <div (click)="handleGoBoardFromNoti(noti.board!.id)" id="noti" class="row py-2 m-0 d-flex justify-content-center align-items-center  px-3 " style="cursor:pointer">
           <div id="noti-icon-container" class="col-2 p-0" >
             <p id="icon" class="rounded-5 d-flex justify-content-center align-items-center " [style]="'width:40px;height:40px;'+'background:'+noti.board!.iconColor+';'">
                <span class="text-dark  fs-5">{{ noti.board!.boardName[0].toUpperCase() }}</span>
             </p>
           </div>
           <div id="noti-body" class="col-10">
              <h6 class="p-0 m-0" style="font-size:14px !important;letter-spacing:0.4px;">{{  noti.content.length > 60 && noti.isInvitiation ? noti.content.substring(0,60)+'...' : noti.content }}</h6>
              <small style="font-size:10px;">{{ noti.createdDate | pentaDate }}</small>
           </div>
        </div>
    `
})
export class NotiComponent implements OnInit {

    @Input('noti') noti : Notification = new Notification();

    constructor( private boardStore : BoardStore , private router : Router ){}

    ngOnInit() : void {}

    handleGoBoardFromNoti( boardId : number ){
       if( window.location.href.includes(`/boards/${boardId}`)){
        window.location.href = `/boards/${boardId}`;
        return;
       }
       this.router.navigateByUrl(`/boards/${boardId}`);
       $('#noti-dropdown').click();
    }

}