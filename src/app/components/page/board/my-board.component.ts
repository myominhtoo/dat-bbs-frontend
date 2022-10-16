import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Stage } from "src/app/model/bean/stage";
import { TaskCard } from "src/app/model/bean/taskCard";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'my-board',
    templateUrl : './my-board.component.html'
})
export class MyBoardComponent{

    stage : Stage [] = [];
    tasks : TaskCard [] = [];

    constructor( public toggleStore : ToggleStore , public route : ActivatedRoute ){
        console.log(route.snapshot.params['id'])
    }

}