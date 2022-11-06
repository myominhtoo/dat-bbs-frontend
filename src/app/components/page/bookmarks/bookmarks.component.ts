import { BoardBookMark } from './../../../model/bean/BoardBookMark';
import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";

@Component({
    selector :'bookmarks',
    templateUrl : './bookmarks.component.html'
})
export class BoardMarkComponent{
    bookmark: BoardBookMark = new BoardBookMark;
    constructor( public toggleStore : ToggleStore ){document.title = "BBMS | Bookmarks";}

    

}