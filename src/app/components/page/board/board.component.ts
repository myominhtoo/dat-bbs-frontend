import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'board',
    templateUrl : './board.component.html'
})
export class BoardComponent{
    constructor( public toggleStore : ToggleStore , public route : ActivatedRoute ){
        console.log(route.snapshot.params['id'])
    }
}