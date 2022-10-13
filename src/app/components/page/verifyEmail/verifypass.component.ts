import { Component, EventEmitter, Output } from  "@angular/core";

@Component({
    selector : 'verify-pass',
    templateUrl:'./verifypass.component.html'
})
export class VerifypassComponent{

    @Output('handle-back') handleBack : EventEmitter<Function> = new EventEmitter();

}