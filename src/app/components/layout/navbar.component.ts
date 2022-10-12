import { Component  } from  "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector : 'navbar',
    templateUrl:"./navbar.components.html",
})
export class NavbarComponent{
    
    constructor( private toggleStore : ToggleStore ){}

    toggleSidebar(){
        this.toggleStore.isShow = !this.toggleStore.isShow;
    }

}