import { Injectable } from '@angular/core';
import { Board } from '../../bean/board';
import { TaskCard } from '../../bean/taskCard';

@Injectable({
    providedIn : 'root'
})
export class BoardTasksStore{

    public board : Board = new Board();
    public taskCards : TaskCard [] = [];
    public hasGotData : boolean  = false;

}