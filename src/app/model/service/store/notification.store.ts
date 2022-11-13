import { Injectable } from "@angular/core";
import { Notification } from '../../bean/notification';
import { UserService } from "../http/user.service";
import { UserStore } from "./user.store";
import swal from "sweetalert";

@Injectable({
  providedIn : 'root'
})
export class NotificationStore{

  constructor( private userStore : UserStore , 
    private userService : UserService  ){
      if( this.userStore.user.id ) this.getNotifications(this.userStore.user.id);
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

}