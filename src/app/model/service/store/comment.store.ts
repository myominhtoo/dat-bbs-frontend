import { Injectable } from "@angular/core";
import { Comment } from "../../bean/comment";

@Injectable({
    providedIn : 'root'
})
export class CommentStore{
    commentsMap : Map<number,Map<number,Comment[]>>  = new Map();
}