import { Board } from './../../model/bean/board';

import { BoardStore } from 'src/app/model/service/store/board.store';
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector : 'sidebar',
    templateUrl:'./sidebarcomponent.html'
})
export class SidebarComponent implements OnInit {
    
   sideBoards:Board[]=[];
   storeUser = JSON.parse(decodeURIComponent(escape(window.atob(`${localStorage.getItem(window.btoa(('user')))}`)))); 
   
   constructor( public toggleStore : ToggleStore , 
        public boardStore:BoardStore , 
        private router : Router ){
        setTimeout(() => {
            this.getBoards();
        
        },500);
    }

    ngOnInit(): void {
        
    }
    
    


    handleGoBoard( boardId : number ){
        this.router.navigateByUrl(`/boards/${boardId}`,);
    }

    getBoards(){
        this.sideBoards=this.boardStore.boards.filter(val=> val.user.id==this.storeUser.id);
    }
    
   
    
    
}   