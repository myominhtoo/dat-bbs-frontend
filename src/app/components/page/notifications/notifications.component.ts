import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'notifications',
    templateUrl  : './notifications.component.html'
})
export class NotificationsComponent{
    constructor( public toggleStore : ToggleStore ){}
}