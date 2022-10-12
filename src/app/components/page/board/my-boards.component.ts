import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'my-boards',
    templateUrl : './my-boards.component.html'
})
export class MyBoardsComponent{
    constructor( public toggleStore : ToggleStore ){}
}