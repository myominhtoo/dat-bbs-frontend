import { TaskCardService } from 'src/app/model/service/http/taskCard.service';
import { map } from 'rxjs';
import { UserService } from 'src/app/model/service/http/user.service';
import { BoardsHasUsers } from './../../../model/bean/BoardsHasUser';
import { Board } from './../../../model/bean/board';
import { User } from './../../../model/bean/user';
import { BoardStore } from './../../../model/service/store/board.store';

import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from "src/app/model/service/store/user.store";
import { COLORS } from "src/app/model/constant/colors";
import { getRandom  } from "src/app/util/random";
import { TaskCard } from 'src/app/model/bean/taskCard';

@Component({
    selector : 'home',
    templateUrl : './home.component.html',
})
export class HomeComponent implements OnInit {

    date=new Date();
    carouselDiv:number=0;
    scrollWidthDiv: any;
        dragStatus={
            isDragStart : false,
            isDragging : false,            
        }        
        prevPageX!:number;
        prevScrollLeft!:number;
        positionDiff!:number;
    
    username : string = '';
    period : string = 'Good Morning';
    dateObj = new Date();
   
    user=new User();
    homeBoards:Board[]=[];
    allTaskCardList:TaskCard[]=[]
    upComingtaskCardList: TaskCard[] = []

    collaborators : User [] = [];

    OverdueTaskList:TaskCard[]=[]
    CompletedTaskList: TaskCard[] = []
 
    status = {
        isLoading : false,
        hasDoneFetching: false,
        hasTaskFetching: false,
        upComingTab: true,
        overDueTab: false,
        completedTab: false

    }    
    
    constructor(public toggleStore: ToggleStore,
        public userStore: UserStore, public userService: UserService,
        public boardStore: BoardStore, private taskCardService: TaskCardService
        ){
        document.title = "BBMS | Home";
        this.username = this.userStore.user.username;
        this.typeAnimate();      
    }

    ngOnInit(): void {       
        this.calculatePeriod();
        setTimeout(()=>{
            this.countUp()  
            this.userStore.fetchUserData();  
            this.user = this.userStore.user;
            this.homeBoards = this.boardStore.ownBoards;            
            if (this.user) {
                this.getCollaborators( this.user.id );
                this.getMyTasks(this.user.id)           
            }        
        },500)  
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

    showHideIcons() {   
        const carousel =  document.getElementById('carousel') ! ;
        let scrollWidth=carousel.scrollWidth - carousel.clientWidth;    
        this.scrollWidthDiv = scrollWidth;           
        
    }
    
    iconClick(id:string){
        const carousel =  document.getElementById('carousel') ! ;
        const firstDiv =  document.getElementById('firstDiv') !;
        const firstImgWidth = firstDiv.clientWidth +14;
        carousel.scrollLeft += id == "left" ? -firstImgWidth : firstImgWidth;    
        this.carouselDiv=carousel.scrollLeft;      
        setTimeout(() => this.showHideIcons(), 60);
    }
    

    countUp(){
        
        let valueInfo = document.querySelectorAll("#count");    
        let interval = 50
        
        valueInfo.forEach((value)=>{
            let initialValue=0          
            setTimeout(()=>{
                let end= Number(value.getAttribute("data-count"));;                        
    
                let counter=setInterval(()=>{
                    initialValue +=1                
                    value.innerHTML = `${initialValue}`;
                    if (end == 0) {
                        value.innerHTML = `0`;
                        clearInterval(counter);
                        
                    } else {
                        
                    if(initialValue === end){
                        clearInterval(counter);
                    }    
                    }                  
                },interval)
            },500)
            
          
        })
    }    

    getCollaborators( userId : number ){
        this.userService.getCollaborators( userId )
        .subscribe({
            next : resUsers => {
                this.collaborators = resUsers;
            } 
        });
    }

    public getMyTasks(userId: number) {
        this.status.isLoading=true
        this.status.hasTaskFetching=false
            
        this.taskCardService.showMyTasks(userId).subscribe({
            next:(res)=>{
    
                this.allTaskCardList = res.filter((res)=> {
                    return res.board.deleteStatus==false && res.deleteStatus==false;
                });               
                console.log(this.allTaskCardList)
                this.status.isLoading=false
            this.status.hasTaskFetching=true
               
            }, error: (err) => {
    
            }
        })
        
    }
    
    myPriorities(title: String) {
           
        if (title == "Upcoming") {
            this.status.upComingTab = true
            // this.upComingtaskCardList=this.allTaskCardList.filter((res)=>{    
            //     return res.stage.id==1;
            // })
            this.status.completedTab = false
            this.status.overDueTab = false
        } else if (title == "Overdue") {
            this.status.overDueTab = true
            this.OverdueTaskList = this.allTaskCardList.filter((res) => {
                let endDate = new Date(res.endedDate);
                return this.date.getTime() > endDate.getTime();
            })
            this.status.upComingTab = false
            this.status.completedTab=false
        } else if (title == "Completed") {
            this.status.completedTab = true   
            this.CompletedTaskList = this.allTaskCardList.filter((res) => {
                return res.stage.id == 3;
            })
            this.status.upComingTab = false
            this.status.overDueTab = false
        }
    }
        duplicateValue(arr:Array<User>){

    }
}


