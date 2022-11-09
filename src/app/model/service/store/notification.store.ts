import { Injectable } from "@angular/core";
import { Notification } from '../../bean/notification';

@Injectable({
  providedIn : 'root'
})
export class NotificationStore{

  public notifications : Notification = [];

}