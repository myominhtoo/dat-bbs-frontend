import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from "src/app/model/service/store/user.store";

@Component({
    selector : 'home',
    templateUrl : './home.component.html',
})
export class HomeComponent {

    username : string = '';

    constructor( public toggleStore : ToggleStore , public userStore : UserStore ){
        document.title = "BBMS | Home";
        this.username = this.userStore.user.username;
        this.typeAnimate();
    }

    typeAnimate(){
        let lastIdx = 0;
        let times = 0;
        const typeInterval = setInterval(() => {
            if( times == 1 ){
                clearInterval(typeInterval);
                this.username = this.userStore.user.username;
            }else{
                if( lastIdx > this.userStore.user.username.length ){
                    lastIdx = 0;
                    times++;
                }else{
                    this.username = this.userStore.user.username.substring( 0 , lastIdx );
                }
                lastIdx++;
            }
        } , 300 );
    }

}



    