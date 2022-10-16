import { Component, Input } from "@angular/core";

@Component({
    selector : 'loading',
    template : `
        <div *ngIf="show" class="w-100 d-flex justify-content-center flex-column align-items-center" style="height:70vh !important;">
            <p class="spinner-border thm" style="width:50px;height:50px;"></p>
            <h5 class="my-1 text-muted">Loading {{ target | titlecase }}...</h5>
        </div>
    `
})
export class LoadingComponent{

    @Input('show') show : boolean = false;
    @Input('target') target : string = 'Datas';

}