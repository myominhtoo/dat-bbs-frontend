import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Board } from "../../bean/board";
import { HttpResponse } from "../../bean/httpResponse";
import { Observable, observable } from "rxjs";

@Injectable({
    providedIn  : 'root'   
})

export class BoardService{
    constructor ( private httpClient : HttpClient ){
    }
    createBoard(board: Board) : Observable <HttpResponse> {
      return this.httpClient.post<HttpResponse> (`http://localhost:8080/api/create-board` ,  board);
    }
}