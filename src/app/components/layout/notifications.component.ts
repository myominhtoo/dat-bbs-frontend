import { NotificationStore } from 'src/app/model/service/store/notification.store';
import { UserStore } from './../../model/service/store/user.store';
import { UserService } from './../../model/service/http/user.service';
import { Component, Input } from "@angular/core";
import { M } from 'chart.js/dist/chunks/helpers.core';
import { Notification } from 'src/app/model/bean/notification';

@Component({
    selector : 'notifications',
    templateUrl : './notifications.component.html'
})
export class Notifications {
   
    @Input('notificaions') notifications: Notification[] = [];
    
    constructor(private userStore: UserStore,private userService:UserService,private notiStore : NotificationStore) {}

    markAllRead() {
        let readAllNoti:Notification[]=[]
        for (let notis of this.notifications) {            
            notis.seenUsers.push(this.userStore.user);
            readAllNoti.push(notis);
        }
        this.userService.markAllNoti(readAllNoti,this.userStore.user.id).subscribe({
            next: (res) => {
                this.notiStore.seenNotis = this.notiStore.notifications;
                
            },
            error: (err) => {
                console.log()
            }
        })
    }
}