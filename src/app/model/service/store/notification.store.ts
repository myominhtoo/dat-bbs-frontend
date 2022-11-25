import { Injectable } from "@angular/core";
import { Notification } from '../../bean/notification';
import { UserService } from "../http/user.service";
import { UserStore } from "./user.store";
import swal from "sweetalert";

@Injectable({
  providedIn : 'root'
})
export class NotificationStore{
 filterNoti: Notification[] = []
  getNoti: Notification[] = []
  notiCount : number = 0;
  constructor( private userStore : UserStore , 
    private userService: UserService) {
      setTimeout(() => {
        this.getNotiCount(this.userStore.user.id);  
        },1800)  
  
      // if( this.userStore.user.id ) this.getNotifications(this.userStore.user.id);
  }
 
  
 
  public notifications : Notification [] = [];

  private getNotifications( userId : number ){
    this.userService.getNotificationsForUser( userId )
    .subscribe({
      next : resNotis => {
        this.notifications = resNotis;
      },
      error : err => {
        swal({
          text : 'Failed to fetch notificaions!',
          icon : 'warning'
        });
      }
    });
  }

  public reFetchNotis( userId : number ){
    this.getNotifications( userId );
  }
  getNotiCount(userId: number) {
  
    
    this.getNoti = this.notifications.filter((res) => {
      return res.sentUser.id !== userId;
    })
    
    this.filterNoti = this.notifications.filter(res => {
      return res.seenUsers.some(res => res.id == userId)
    })
    this.notiCount = this.getNoti.filter((res) => !this.filterNoti.includes(res)).length;
    
  }

}