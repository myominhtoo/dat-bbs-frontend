import { Injectable } from '@angular/core';
import { Board } from '../../bean/board';
import { Stage } from '../../bean/stage';
import { TaskCard } from '../../bean/taskCard';
import { User } from '../../bean/user';

@Injectable({
    providedIn : 'root'
})
export class BoardTasksStore{

    public board : Board = new Board();
    public taskCards : TaskCard [] = [];
    public hasGotData : boolean  = false;
    //added for taskcard chart
    public stages : Stage []=[];
  
}