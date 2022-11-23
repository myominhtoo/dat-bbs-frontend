import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '../../bean/httpResponse';
import { Observable } from 'rxjs';
import { BoardBookMark } from '../../bean/BoardBookMark';
import { Board } from '../../bean/board';

@Injectable({
    providedIn : 'root'
})
export class BoardBookMarkService{

    constructor( private httpClient : HttpClient ){}

    public toggleBookMark( boardBookMark : BoardBookMark ) : Observable<HttpResponse<BoardBookMark>> {
        return this.httpClient.post<HttpResponse<BoardBookMark>>(`http://localhost:8080/api/users/${boardBookMark.user.id}/board-bookmark` , boardBookMark );
    }

    showBookmarks ( userId : number ) : Observable <BoardBookMark[]> {
        return this.httpClient.get<BoardBookMark[]>(`http://localhost:8080/api/users/${userId}/board-bookmarks`);
    }

    public reportBookMark (id : number,format : string ){
        const headers = new HttpHeaders();
        headers.set('Accept', 'application/octet-stream');
        return this.httpClient.get<any> (`http://localhost:8080/api/users/${id}/report-bookmark?format=${format}`, { responseType : 'blob' as 'json', observe : 'response'} );
    }

}