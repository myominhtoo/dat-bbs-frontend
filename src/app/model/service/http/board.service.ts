import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Board } from "../../bean/board";
import { HttpResponse } from "../../bean/httpResponse";
import { Observable } from "rxjs";

@Injectable({
    providedIn  : 'root'   
})

export class BoardService{

    constructor ( private httpClient : HttpClient ){
    }

    createBoard(board: Board) : Observable <HttpResponse<any>> {
      return this.httpClient.post<HttpResponse<any>> (`http://localhost:8080/api/create-board` ,  board);
    }

    getBoardsForUser( userId : number ) : Observable<Board[]> {
      return this.httpClient.get<Board[]>(`http://localhost:8080/api/users/${userId}/boards`);
    }

    getBoardWithBoardId( boardId : number ) : Observable<Board> {
      return this.httpClient.get<Board>(`http://localhost:8080/api/boards/${boardId}`);
    }

    inviteMembersToBoard( boardId : number , board : Board) : Observable<Board[]> {
      return this.httpClient.post<Board[]> (`http://localhost:8080/api/boards/${boardId}/invite-members` ,board);
    }

    updateBoard(board: Board) : Observable<HttpResponse<Board>>{
      return this.httpClient.put<HttpResponse<Board>>(`http://localhost:8080/api/update-board`,board)
    }

}

