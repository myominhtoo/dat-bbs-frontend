import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '../../bean/httpResponse';
import { Observable } from 'rxjs';
import { BoardBookMark } from '../../bean/BoardBookMark';

@Injectable({
    providedIn : 'root'
})
export class BoardBookMarkService{

    constructor( private httpClient : HttpClient ){}

    public toggleBookMark( boardBookMark : BoardBookMark ) : Observable<HttpResponse<BoardBookMark>> {
        return this.httpClient.post<HttpResponse<BoardBookMark>>(`http://localhost:8080/api/users/${boardBookMark.user.id}/board-bookmark` , boardBookMark );
    }

}