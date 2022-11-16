import { BoardsHasUsers } from './../../../model/bean/BoardsHasUser';
import { Board } from './../../../model/bean/board';
import { User } from './../../../model/bean/user';
import { BoardStore } from './../../../model/service/store/board.store';

import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { UserStore } from "src/app/model/service/store/user.store";
import { COLORS } from "src/app/model/constant/colors";
import { getRandom  } from "src/app/util/random";

@Component({
    selector : 'home',
    templateUrl : './home.component.html',
})
export class HomeComponent implements OnInit {
    @ViewChild("carousel",{static:true}) carousel!: ElementRef;//document Element
    @ViewChild("firstDiv",{static:true}) firstDiv!: ElementRef;    
    @ViewChild("countUp",{static:true}) count!: ElementRef;
    date=new Date();
    scrollWidthDiv!:number;        
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
    homeCollaborator:Board[]=[]
    
    constructor( public toggleStore : ToggleStore , public userStore : UserStore,public boardStore:BoardStore ){
        document.title = "BBMS | Home";
        this.username = this.userStore.user.username;
        this.typeAnimate();
        
        
    }

    ngOnInit(): void {
        this.countUp()
        this.calculatePeriod();
        
        setTimeout(()=>{
            this.scrollWidthDiv = this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth;
            this.user=this.userStore.user;
            // this.homeBoards=this.boardStore.ownBoards;            
            // this.homeCollaborator=this.boardStore.boardsHasUsers.map((res)=>res.board);
           
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

// Start Carousel
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

    showHideIcons(){            
        // console.log("Show Hide Icons",this.carousel.nativeElement.scrollLeft)
        // console.log( this.firstDiv.nativeElement.clientWidth + 14)
        // console.log("scrollLeft",this.carousel.nativeElement.scrollLeft);

        return this.carousel.nativeElement.scrollLeft;
    }

    dragStart(e:any){
        // console.log("dragStart is working")
        this.dragStatus.isDragStart = true;
        this.prevPageX = e.pageX || e.touches[0].pageX;
        this.prevScrollLeft = this.carousel.nativeElement.scrollLeft;
    }

    dragging(e:any){
        // console.log("dragging is working");
        if(!this.dragStatus.isDragStart) return;
        e.preventDefault();
        this.dragStatus.isDragging = true;
        this.carousel.nativeElement.classList.add("dragging");
        this.positionDiff = (e.pageX || e.touches[0].pageX) - this.prevPageX;
        this.carousel.nativeElement.scrollLeft = this.prevScrollLeft - this.positionDiff;
        this.showHideIcons();
    }
    dragStop(){
        // console.log("dragStop is working");
        this.dragStatus.isDragStart = false;
        this.carousel.nativeElement.classList.remove("dragging");
        if(!this.dragStatus.isDragging) return;
        this.dragStatus.isDragging = false;
        this.autoSlide();
    }
    
    iconClick(id:string){
        // console.log(id)
        let firstImgWidth = this.firstDiv.nativeElement.clientWidth + 14;
        this.carousel.nativeElement.scrollLeft += id == "left" ? -firstImgWidth : firstImgWidth;
        setTimeout(() => this.showHideIcons(), 60);
    }
    
    
    autoSlide(){
         // if there is no image left to scroll then return from here
        if(this.carousel.nativeElement.atscrollLeft - (this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth) > -1 || this.carousel.nativeElement.scrollLeft <= 0) return;

        this.positionDiff = Math.abs(this.positionDiff); // making positionDiff value to positive
        let firstImgWidth = this.firstDiv.nativeElement.clientWidth + 14;
        // getting difference value that needs to add or reduce from this.carousel left to take middle img center
        let valDifference = firstImgWidth - this.positionDiff;

        if(this.carousel.nativeElement.scrollLeft > this.prevScrollLeft) { // if user is scrolling to the right
            return this.carousel.nativeElement.scrollLeft += this.positionDiff > firstImgWidth / 3 ? valDifference : -this.positionDiff;
        }
        // if user is scrolling to the left
        this.carousel.nativeElement.scrollLeft -= this.positionDiff > firstImgWidth / 3 ? valDifference : -this.positionDiff;
    }
    
    // End Carousel

    countUp(){
        let valueInfo=document.querySelectorAll("#count");    
        let interval=400
        
        valueInfo.forEach((value)=>{
            let initialValue=0
            
            setTimeout(()=>{
                let end= Number(value.getAttribute("data-count"));;                        
                
                let counter=setInterval(()=>{
                    initialValue +=1                
                    value.innerHTML=`${initialValue}`;
                    if(initialValue === end){
                        clearInterval(counter);
                    }
                },interval)
            },600)
            
            
        })
    }    


}


