import { HttpClient  } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Comment } from "../../bean/comment";
import { HttpResponse  } from "../../bean/httpResponse";

@Injectable({
    providedIn : 'root'
})
export class CommentService{
    constructor ( private httpClient : HttpClient ){}

    createComment( comment : Comment ) : Observable <HttpResponse<Comment>>{
        return this.httpClient.post<HttpResponse<Comment>> (`http://localhost:8080/api/create-comment` , comment);
    }

    getComments( id : number ) : Observable<Comment[]> {
        return this.httpClient.get<Comment[]> (`http://localhost:8080/api/tasks/${id}/comments`);
    }

    deleteComment(commentId : Number) : Observable<HttpResponse<Comment>>{
        return this.httpClient.delete<HttpResponse<Comment>>(`http://localhost:8080/api/comment/delete-comment?id=${commentId}`);
    }
}

