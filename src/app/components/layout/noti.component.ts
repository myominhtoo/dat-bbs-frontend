import { Component, Input } from "@angular/core";
import { Notification } from "src/app/model/bean/notification";

@Component({
    selector : 'noti',
    template : `
        <div id="noti">
            
        </div>
    `
})
export class NotiComponent {

    @Input('noti') noti : Notification = new Notification();

}