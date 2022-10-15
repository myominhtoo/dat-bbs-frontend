import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'my-board',
    templateUrl : './my-board.component.html'
})
export class MyBoardComponent{
    constructor( public toggleStore : ToggleStore , public route : ActivatedRoute ){
        console.log(route.snapshot.params['id'])
    }
}