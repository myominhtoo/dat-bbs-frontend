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
    readAllNoti:Notification[]=[]
    @Input('notificaions') notifications: Notification[] = [];
    
    constructor(private userStore: UserStore,private userService:UserService,private notiStore : NotificationStore) {}

    markAllRead() {

        for (let notis of this.notifications) {            
            notis.seenUsers.push(this.userStore.user);
            this.readAllNoti.push(notis);
        }
        this.userService.markAllNoti(this.readAllNoti,this.userStore.user.id).subscribe({
            next: (res) => {
                // setTimeout(() => {
                this.notiStore.getNotiCount(this.userStore.user.id)    
                // }, 1000);
                
            },
            error: (err) => {
                console.log()
            }
        })
    }
}