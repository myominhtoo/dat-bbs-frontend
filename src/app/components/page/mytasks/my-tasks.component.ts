import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'my-tasks',
    templateUrl : './my-tasks.component.html',
})
export class MyTaskComponent{
    constructor( public toggleStore : ToggleStore ){}
}