import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Notification } from "src/app/model/bean/notification";
import { BoardStore } from "src/app/model/service/store/board.store";

@Component({
    selector : 'noti',
    template : `
        <div (click)="handleGoBoardFromNoti(noti.board!.id)" id="noti" class="row py-2 m-0 d-flex justify-content-center align-items-center ps-3 pe-0 mb-1" [style.borderLeft]="borderLeft" >
           <div id="noti-icon-container" class="col-2 p-0" >
             <p id="icon" class="rounded-5 d-flex justify-content-center align-items-center " [style]="'width:48px;height:48px;'+'background:'+noti.board!.iconColor+';'">
                <img *ngIf="noti.sentUser.imageUrl != null" class="rounded-5" style="width:48px;height:48px;object-fit:cover;" [src]="'http://localhost:8080/img/'+noti.sentUser.imageUrl"/>
                <span *ngIf="noti.sentUser.imageUrl == null" class="text-light fs-5">{{ noti.sentUser.username[0].toUpperCase() }}</span>
             </p>
           </div>
           <div id="noti-body" class="col-10 ps-2 pe-1 text-justify">
              <h6 *ngIf="!noti.invitiation" class="p-0 m-0 " style="font-size:13px !important;letter-spacing:0.4px;line-height:1.3;">{{  noti.content.length > 80 ? noti.content.substring(0,80)+'...' : noti.content }}</h6>
              <h6 *ngIf="noti.invitiation" class="p-0 m-0 " style="font-size:13px !important;letter-spacing:0.4px;line-height:1.3;">{{  noti.content }}</h6>
              <small style="font-size:10px;" class="text-primary">{{ noti.createdDate | pentaDate }}</small>
           </div>
        </div>
    `
})
export class NotiComponent implements OnInit {

    borderLeft : string = 'none !important';

    @Input('noti') noti : Notification = new Notification();

    constructor( private boardStore : BoardStore , private router : Router ){}

    ngOnInit() : void {
      if(this.noti.invitiation){
         this.borderLeft = `3px solid ${this.noti.board?.iconColor} !important`;
      }else{
         this.borderLeft = `3px solid none`;
      }
    }

    handleGoBoardFromNoti( boardId : number ){
       if( window.location.href.includes(`/boards/${boardId}`)){
        window.location.href = `/boards/${boardId}`;
        return;
       }
       this.router.navigateByUrl(`/boards/${boardId}`);
       $('#noti-dropdown').click();
    }

}