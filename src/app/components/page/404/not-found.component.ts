import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'not-found',
    template : `
        <div class="w-100 my-auto d-flex flex-column justify-content-center align-items-center" style="height:400px;">
            <h5 class="text-muted">404 | Page Not Found!</h5>
            <span routerLink="/home" class="link text-primary text-decoration-underline">Go Home</span>
        </div>
    `
})
export class NotFoundComponent{

    constructor( public toggleStore : ToggleStore ){}

}