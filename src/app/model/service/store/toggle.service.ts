import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn : 'root'
})
export class ToggleStore {
    isShow : boolean = true;
    msg : string = 'hello'  

    // public toggleSidabar(){
    //     this.isShow = !this.isShow;
    // }
   

    isShowSubject=new BehaviorSubject<boolean>(true);

    constructor(){
        let prevState = localStorage.getItem("isShow");
        this.isShowSubject.subscribe(next=>{
                localStorage.setItem("isShow",String(next))
                this.isShow=next;
                
        });
        this.isShowSubject.next(
            prevState == null 
            ? true
            : prevState == "true"
             ? true
             : false
        );
    }

    
}