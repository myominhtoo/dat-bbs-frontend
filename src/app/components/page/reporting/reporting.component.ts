import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'reporting',
    templateUrl : './reporting.component.html'
})
export class ReportingComponent{
    constructor( public toggleStore : ToggleStore ){document.title = "BBMS | Reporting";}
}