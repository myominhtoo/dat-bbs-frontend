import { Injectable } from "@angular/core";

@Injectable({
    providedIn : 'root'
})
export class ToggleStore {
    isShow : boolean = true;
    msg : string = 'hello'  
    // public toggleSidabar(){
    //     this.isShow = !this.isShow;
    // }
}