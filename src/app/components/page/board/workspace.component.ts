import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'workspace',
    templateUrl : './workspace.component.html'
})
export class WorkspaceComponent{
    constructor( public toggleStore : ToggleStore ){}
}