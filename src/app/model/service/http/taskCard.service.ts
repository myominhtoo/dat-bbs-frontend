import { Activity } from 'src/app/model/bean/activity';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResponse } from "../../bean/httpResponse";
import { TaskCard } from "../../bean/taskCard";
import { User } from "../../bean/user";

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

    checkTaskCard( activity:Activity ) : Observable<HttpResponse<TaskCard>> {
        console.log(activity)
        return this.httpClient.put<HttpResponse<TaskCard>>(`http://localhost:8080/api/check-task`,activity);
    }

    showMyTasks( userId : number ) : Observable<TaskCard[]> {
        return this.httpClient.get<TaskCard[]> (`http://localhost:8080/api/users/${userId}/task-cards`);
    }


    exportTaskReport(boardId : number , taskFormat : string ){
        return this.httpClient.get<TaskCard[]>(`http://localhost:8080/api/boards/${boardId}/reportTask?format=${taskFormat}`);
      }
    
    updateDeleteStatusTask( boardId : number , id : number ,taskCard : TaskCard): Observable <TaskCard>{
        return this.httpClient.put<TaskCard>(`http://localhost:8080/api/boards/${boardId}/task-cards?id=${id}`,taskCard);
    }


}
