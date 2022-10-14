import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Stage } from "../../bean/stage";
import { HttpResponse } from "../../bean/httpResponse";

@Injectable({
    providedIn  : 'root'   
})
export class StageService {
  constructor ( private httpClient : HttpClient ){
  }

  createStage( stage : Stage ) : Observable<HttpResponse> {
    return this.httpClient.post <HttpResponse> (`http://localhost:8080/api/create-stage` ,  stage);
  }

  getBoardId ( boardId : Number) : Observable<HttpResponse>{
    return this.httpClient.get <HttpResponse> (`http://localhost:8080/api/create-board?boardId=${boardId}`);
  }
}