import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity } from "../../bean/activity";

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
}
