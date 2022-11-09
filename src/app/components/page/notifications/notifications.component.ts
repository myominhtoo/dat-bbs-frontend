import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { Client } from 'stompjs';

@Component({
    selector : 'notifications',
    templateUrl  : './notifications.component.html'
})
export class NotificationsComponent{

    stompClient : Client | undefined;

    constructor( public toggleStore : ToggleStore ){document.title = "BBMS | Notification";}

}