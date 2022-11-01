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

  createStage( stage : Stage ) : Observable<HttpResponse<Stage>> {
    return this.httpClient.post <HttpResponse<any>> (`http://localhost:8080/api/create-stage` ,  stage);
  }

  getStagesForBoard ( boardId : Number) : Observable<Stage[]>{
    return this.httpClient.get <Stage[]> (`http://localhost:8080/api/stages?boardId=${boardId}`);
  }

  editStageName( stage : Stage ) : Observable<HttpResponse<Stage>>{
    return this.httpClient.put<HttpResponse<Stage>>(`http://localhost:8080/api/update-stage` , stage );
  }

  deleteStage( stageId : Number ) : Observable<HttpResponse<Stage>>{
    return this.httpClient.delete<HttpResponse<Stage>>(`http://localhost:8080/api/delete-stage?id=${stageId}`);
  }
}