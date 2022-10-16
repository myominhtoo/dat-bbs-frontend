import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector :'create-taskCard',
    templateUrl : './create-taskCard.component.html'
})
export class CreateTaskCardComponent {
    constructor( public toggleStore : ToggleStore ){}

}