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
    @ViewChild("carousel",{static:true}) carousel!: ElementRef;
    @ViewChild("firstDiv",{static:true}) firstDiv!: ElementRef;    
    @ViewChild("countUp", { static: true }) count!: ElementRef;
    date=new Date();
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
    // boardsHasUsers:BoardsHasUsers[]=[];    
    user=new User();
    homeBoards:Board[]=[];
    homeCollaborator: User[] = []
    
    allTaskCardList:TaskCard[]=[]
    upComingtaskCardList: TaskCard[] = []

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
                this.getAllMembers(this.user.id)
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
        let scrollWidth=this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth;    
        this.scrollWidthDiv = scrollWidth;   
    }

    dragStart(e:any){
        
        this.dragStatus.isDragStart = true;
        this.prevPageX = e.pageX || e.touches[0].pageX;
        this.prevScrollLeft = this.carousel.nativeElement.scrollLeft;
    }

    dragging(e:any){
        
        if(!this.dragStatus.isDragStart) return;
        e.preventDefault();
        this.dragStatus.isDragging = true;
        this.carousel.nativeElement.classList.add("dragging");
        this.positionDiff = (e.pageX || e.touches[0].pageX) - this.prevPageX;
        this.carousel.nativeElement.scrollLeft = this.prevScrollLeft - this.positionDiff;
        this.showHideIcons();
    }
    dragStop(){
        
        this.dragStatus.isDragStart = false;
        this.carousel.nativeElement.classList.remove("dragging");
        if(!this.dragStatus.isDragging) return;
        this.dragStatus.isDragging = false;
        this.autoSlide();
    }
    
    iconClick(id:string){
        let firstImgWidth = this.firstDiv.nativeElement.clientWidth + 14;
        this.carousel.nativeElement.scrollLeft += id == "left" ? -firstImgWidth : firstImgWidth;   
        setTimeout(() => this.showHideIcons(), 60);
    }
    
    
    autoSlide(){
        if(this.carousel.nativeElement.atscrollLeft - (this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth) > -1 || this.carousel.nativeElement.scrollLeft <= 0) return;
        this.positionDiff = Math.abs(this.positionDiff); 
        let firstImgWidth = this.firstDiv.nativeElement.clientWidth + 14;
        
        let valDifference = firstImgWidth - this.positionDiff;
        console.log("Value Difference", valDifference)
        console.log("FirstImgWidth", firstImgWidth)
        console.log("postionDiff", this.positionDiff)
        console.log("this.positionDiff > firstImgWidth / 3 ? valDifference : -this.positionDiff", this.positionDiff > firstImgWidth / 3 ? valDifference : -this.positionDiff)
        console.log("this.carousel.nativeElement.scrollLeft", this.carousel.nativeElement.scrollLeft)
        console.log("this.prevScrollLeft",this.prevScrollLeft)
        if(this.carousel.nativeElement.scrollLeft > this.prevScrollLeft) { 
            return this.carousel.nativeElement.scrollLeft += this.positionDiff > firstImgWidth / 3 ? valDifference : -this.positionDiff;
        }
        
        this.carousel.nativeElement.scrollLeft -= this.positionDiff > firstImgWidth / 3 ? valDifference : -this.positionDiff;
    }
    
    

    countUp(){
        
        let valueInfo=document.querySelectorAll("#count");    
        let interval=50
        
        valueInfo.forEach((value)=>{
            let initialValue=0
            
            setTimeout(()=>{
                let end= Number(value.getAttribute("data-count"));;                        
                console.log("end",end);
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
            },400)
            
          
        })
    }    

    public getAllMembers(userId: number) {
        this.userService.getAllMembers(userId).subscribe({
            next:(res)=>{                      
                
                let prevUserId = 0;                
                this.homeCollaborator = res.map( boardHasUser => boardHasUser.board.user )
                                        .filter( user => {
                                            if( prevUserId != user.id ){
                                                prevUserId = user.id;                                                
                                                return true;
                                            }
                                            return false;
                                        } )        //filter duplicate value        

                console.log("Home",this.homeCollaborator)
                
                
            },error:(err)=>{
                console.log(err)
            }
        })
    }

    public getMyTasks(userId: number) {
        this.status.isLoading=true
        this.status.hasTaskFetching=false
            
        this.taskCardService.showMyTasks(userId).subscribe({
            next:(res)=>{
                // console.log(res)
                this.allTaskCardList = res.filter((res)=> {
                    return res.board.deleteStatus==false && res.deleteStatus==false;
                });
                // this.upComingtaskCardList=this.allTaskCardList.filter((res)=>{    
                //     return res.stage.id==1;
                // })
                this.status.isLoading=false
            this.status.hasDoneFetching=true
               
            }, error: (err) => {
                console.log(err)
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
}


