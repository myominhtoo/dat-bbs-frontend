import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn : 'root'
})
export class CommentService{
    constructor ( private httpClient : HttpClient ){}

    createComment( comment : Comment ) : Observable <HttpResponse<Comment>>{
        return this.httpClient.post<HttpResponse<Comment>> (`http://localhost:8080/api/create-comment` , comment);
    }

    getComment( id : number ) : Observable<Comment[]> {
        return this.httpClient.get<Comment[]> (`http://localhost:8080/api/task-card/${id}/comments`);
    }

}