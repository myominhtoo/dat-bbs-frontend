import { Component, OnInit } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from "src/app/model/service/store/user.store";
import { COLORS } from "src/app/model/constant/colors";
import { getRandom  } from "src/app/util/random";

@Component({
    selector : 'home',
    templateUrl : './home.component.html',
})
export class HomeComponent implements OnInit {

    username : string = '';
    period : string = 'Good Morning';
    colors : string [] = [ '#1f4287', '#17b978', '#086972' , '#086972' , '#6e3b3b'];
    dateObj = new Date();

    constructor( public toggleStore : ToggleStore , public userStore : UserStore ){
        document.title = "BBMS | Home";
        this.username = this.userStore.user.username;
        this.typeAnimate();
    }

    ngOnInit(): void {
        this.calculatePeriod();
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
        } , 200 );
    }

    private calculatePeriod(){
        const hour = this.dateObj.getHours();   
    
        switch( true ){
            case hour <= 12 : 
                this.period = "Good Morning";
                break;
            case hour > 12 && hour <= 15 : 
                this.period = "Good Afternoon";
                break;
            case hour > 15 && hour <= 19:
                this.period = "Good Evening";
                break;
            case hour > 19 :
                this.period = "Good Night";
                break;
        }
    }

    random(){
        return getRandom(this.colors.length - 1);
    }
}



    