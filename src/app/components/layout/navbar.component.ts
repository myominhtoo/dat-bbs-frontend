import { Subject, Observable } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/model/bean/user";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from 'src/app/model/service/store/user.store';

@Component({
    selector : 'navbar',
    templateUrl:"./navbar.components.html",
})
export class NavbarComponent{
    
    constructor( private toggleStore : ToggleStore , 
        public userStore : UserStore ){
            userStore.fetchUserData();
        }

    b = true;

    toggleSidebar(){
        this.toggleStore.isShow=!this.toggleStore.isShow;
        let show=this.toggleStore.isShowSubject.value;
        this.toggleStore.isShowSubject.next(!show);
    }

}