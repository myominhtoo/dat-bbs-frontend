import { Subject, Observable } from 'rxjs';
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/model/bean/user";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'navbar',
    templateUrl:"./navbar.components.html",
})
export class NavbarComponent implements OnInit {
    
    constructor( private toggleStore : ToggleStore ){}
    b=true;
    user : User = new User();
    private subject = new Subject<any>();

    toggleSidebar(){
        this.toggleStore.isShow=!this.toggleStore.isShow;
        let show=this.toggleStore.isShowSubject.value;
        this.toggleStore.isShowSubject.next(!show);
    }

    ngOnInit(): void {
        
        let storedUser =  JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`))));
        this.user.id = storedUser.id;
        this.user.username = storedUser.username;
        this.user.imageUrl = storedUser.imageUrl;
    }

}