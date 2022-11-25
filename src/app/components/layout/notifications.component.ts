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
    
  
    constructor(private userStore: UserStore,private userService:UserService) {
    
}


    markAllRead() {

        for (let notis of this.notifications) {            
            notis.seenUsers.push(this.userStore.user);
            this.readAllNoti.push(notis);
        }
        this.userService.markAllNoti(this.readAllNoti,this.userStore.user.id).subscribe({
            next: (res) => {
                console.log("It's working")
            },
            error: (err) => {
                console.log()
            }
        })
    //       this.notifications.seenUsers.push(this.userStore.user);
    //   console.log("Noti seen user",this.noti.seenUsers)
    //   this.userService.seenNoti(this.noti).subscribe({
    //      next:(res)=>{
    //         console.log("It's work!")
            
            
    //      },error:(err)=>{
    //         console.log(err)
    //      }
    //   })
    }
}