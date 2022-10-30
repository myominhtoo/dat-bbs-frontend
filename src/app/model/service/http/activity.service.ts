import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity } from "../../bean/activity";
import { HttpResponse } from "../../bean/httpResponse";

@Injectable({
    providedIn : 'root'
})
export class ActivityService{
    constructor ( private httpClient : HttpClient ){}

    createActivity( activity : Activity ) : Observable <HttpResponse<Activity>>{
        return this.httpClient.post<HttpResponse<Activity>> (`http://localhost:8080/api/create-activity` , activity);
    }

    getActivities( taskCardId : number ) : Observable<Activity[]> {
        return this.httpClient.get<Activity[]> (`http://localhost:8080/api/task-card/${taskCardId}/activities`);
    }

    // updateActivity ( boardId : number , activity : Activity ) : Observable<Activity>{
    //     return this.httpClient.put<Activity>(`http://localhost:8080/api/boards/${boardId}/update-activity `, activity);
    // }

  
}
