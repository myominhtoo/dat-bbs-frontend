import { forkJoin } from 'rxjs';
import { Injectable } from "@angular/core";
import { Notification } from '../../bean/notification';
import { UserService } from "../http/user.service";
import { UserStore } from "./user.store";
import swal from "sweetalert";
import { AuthService } from "../http/auth.service";

@Injectable({
  providedIn : 'root'
})
export class NotificationStore{

    public notiCount : number = 0;
    public seenNotis: Notification[] = []
    public notifications : Notification [] = [];
  constructor( 
    private userStore : UserStore , 
    private userService: UserService , 
    private authService : AuthService ) {
      
    if (this.authService.isAuth()) {
      this.getNotifications(this.userStore.user.id);
    }
  }
  
  private getNotifications(userId: number) {
    forkJoin([
      this.userService.getNotificationsForUser(userId),
      this.userService.seenNotiByUserId(userId)])
      .subscribe(([notis, seen]) => {
        this.notifications = notis
        this.seenNotis = seen;
        this.notiCount = this.notifications.length - this.seenNotis.length;
    })

  }

  public reFetchNotis( userId : number ){
    this.getNotifications( userId );
  }

  public calculateNotiCount(){
    this.notiCount = this.notifications.length - this.seenNotis.length;
  }

  
}