import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResponse } from "../../bean/httpResponse";
import { TaskCard } from "../../bean/taskCard";

@Injectable({
    providedIn : 'root'
})
export class TaskCardService {

    constructor ( private httpClient : HttpClient ){}
     
    createTaskCard( taskCard : TaskCard ) : Observable <HttpResponse<TaskCard>>{
        return this.httpClient.post<HttpResponse<TaskCard>> (`http://localhost:8080/api/create-task` , taskCard);
    }

    getTaskCards( boardId : number ) : Observable<TaskCard[]> {
        return this.httpClient.get<TaskCard[]>(`http://localhost:8080/api/boards/${boardId}/task-cards`);
    }

    updateTaskCard( taskCard : TaskCard ) : Observable<HttpResponse<TaskCard>> {
        return this.httpClient.put<HttpResponse<TaskCard>>(`http://localhost:8080/api/update-task` , taskCard  );
    }
    
    

}