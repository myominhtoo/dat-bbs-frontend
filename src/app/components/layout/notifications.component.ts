import { Component, Input } from "@angular/core";
import { Notification } from "src/app/model/bean/notification";

@Component({
    selector : 'notifications',
    templateUrl : './notifications.component.html'
})
export class Notifications {

    @Input('notificaions') notifications : Notification [] = [];

}