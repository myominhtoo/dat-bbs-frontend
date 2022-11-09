import { Board } from './../../model/bean/board';

import { BoardStore } from 'src/app/model/service/store/board.store';
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { Component } from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector : 'sidebar',
    templateUrl:'./sidebarcomponent.html'
})
export class SidebarComponent  {
    
   sideBoards:Board[]=[];
   
   constructor( 
        public toggleStore : ToggleStore , 
        public boardStore:BoardStore , 
        private router : Router , 
    ){
        setTimeout( () => {
           this.sideBoards = this.boardStore.ownBoards;
        } , 500 );
    }
    archiveBoards(){
        this.router.navigateByUrl(`/archive-boards`,);
    }

    handleGoBoard( boardId : number ){
        this.router.navigateByUrl(`/boards/${boardId}`,);
    }

}   