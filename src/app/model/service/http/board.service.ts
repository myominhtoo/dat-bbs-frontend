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

    createBoard(board: Board) : Observable <HttpResponse<Board>> {
      return this.httpClient.post<HttpResponse<Board>> (`http://localhost:8080/api/create-board` ,  board);
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

    getDeletedBoardWithBoardId ( userId : number ) : Observable<Board[]> {
      return this.httpClient.get<Board[]> (`http://localhost:8080/api/archive-boards?userId=${userId}`);
    }

    exportBoardReport(userId : number ,filetype : string){
      return this.httpClient.get<any>(`http://localhost:8080/api/users/${userId}/report-board?format=${filetype}`);
    }

    // exportReport(filetype: string): Observable<Map<string,string>>{
    //   return this.httpClient.get<Map<string,string>>(`http://locahost:8080/api/reportBoard/${filetype}`);
    // }

    exportArchiveBoardReport(id : number ,filetype : string){
      return this.httpClient.get<any>(`http://localhost:8080/api/users/${id}/archive-board-report?format=${filetype}`);
    }

    joinBoard( email: string, code : number, boardId : number){
      return this.httpClient.get<any>(`http://localhost:8080/api/accept-join-board?email=${email}&code=${code}&boardId=${boardId}`);
    }


}

