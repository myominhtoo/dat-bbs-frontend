import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'not-found',
    template : `
        <div class="w-100 my-auto d-flex flex-column justify-content-center align-items-center" style="height:400px;">
            <h5 class="text-muted">404 | Page Not Found!</h5>
            <button routerLink="/home" class="link btn btn-outline-secondary text-decoration-none">Go Home</button>
        </div>
    `
})
export class NotFoundComponent{

    constructor( public toggleStore : ToggleStore ){}

}