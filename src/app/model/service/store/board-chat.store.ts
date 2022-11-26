import { BoardMessage } from './../../bean/BoardMessage';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn : 'root'
})

export class BoardChatStore{
 public boardMap:Map<number,BoardMessage[]>=new Map();

 




}