import { NotificationStore } from 'src/app/model/service/store/notification.store';
import { UserStore } from './../../model/service/store/user.store';
import { UserService } from './../../model/service/http/user.service';
import { Component, Input, OnInit } from "@angular/core";
import { Notification } from 'src/app/model/bean/notification';

@Component({
    selector : 'notifications',
    templateUrl : './notifications.component.html'
})
export class Notifications implements OnInit {
   
    @Input('notificaions') notifications: Notification[] = [];
    // allSeen : boolean = false;
    
    constructor( 
        private userStore: UserStore , 
        private userService:UserService ,
        public notiStore : NotificationStore
    ) {}

    ngOnInit(): void {
       setTimeout(() => {
        if(this.notiStore.notifications.length == this.notiStore.seenNotis.length ){
            // this.allSeen = true;
            this.notiStore.allSeen = true;
        }
       } , 500 );
    }

    markAllRead() {
        let readAllNoti:Notification[]=[]
        for (let notis of this.notifications) {            
           if(!this.notiStore.seenNotis.some( noti => notis.id == noti.id )){
            notis.seenUsers.push(this.userStore.user);
            readAllNoti.push(notis);
           }
        }
        this.userService.markAllNoti(readAllNoti,this.userStore.user.id).subscribe({
            next: (res) => {
               if( res.ok ){
                this.notiStore.seenNotis = this.notiStore.notifications;
                this.notiStore.calculateNotiCount();
                this.notiStore.allSeen = true;
               }
            },
            error: (err) => {
                console.log()
            }
        })
    }
}