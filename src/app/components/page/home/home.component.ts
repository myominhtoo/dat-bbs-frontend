import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'home',
    templateUrl : './home.component.html',
})
export class HomeComponent {
    constructor( public toggleStore : ToggleStore ){}

}