import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector : 'board',
    templateUrl : './board.component.html'
})
export class BoardComponent{
    constructor( public route : ActivatedRoute ){
        console.log(route.snapshot.params['id'])
    }
}