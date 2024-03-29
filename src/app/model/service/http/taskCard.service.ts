import { Activity } from 'src/app/model/bean/activity';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResponse } from "../../bean/httpResponse";
import { TaskCard } from "../../bean/taskCard";
import { User } from "../../bean/user";
import { getStickyHeaderDates } from '@fullcalendar/angular';

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
      const headers = new HttpHeaders();

      headers.set('Accept', 'application/octet-stream');
        return this.httpClient.get<any>(`http://localhost:8080/api/boards/${boardId}/reportTask?format=${taskFormat}` ,{ responseType : 'blob' as 'json', observe : 'response'} );
      }

    updateDeleteStatusTask( boardId : number , id : number ,taskCard : TaskCard): Observable <TaskCard>{
        return this.httpClient.put<TaskCard>(`http://localhost:8080/api/boards/${boardId}/task-cards?id=${id}`,taskCard);
    }

    showDeleteTaskCard(boardId : number):Observable<TaskCard[]>{
      return this.httpClient.get<TaskCard[]>(`http://localhost:8080/api/boards/${boardId}/archive-tasks`)
    }

    // restoreDeleteTask(boardId : number):Observable<TaskCard>{
    //   return this.httpClient.put<TaskCard>(`http://localhost:8080/api/boards/${boardId}/restore-tasks`,taskCard);
    // }


    restoreTask(id : number ,boardId : number, taskCard : TaskCard) : Observable<HttpResponse<TaskCard>>{
      return this.httpClient.put<HttpResponse<TaskCard>>(`http://localhost:8080/api/boards/${boardId}/restore-tasks?id=${id}` , taskCard  );
   }

   exportArchiveTaskReport(boardId : number , taskFormat : string ){
    const headers = new HttpHeaders();

    headers.set('Accept', 'application/octet-stream');
    return this.httpClient.get<any>(`http://localhost:8080/api/boards/${boardId}/reportArchiveTask?format=${taskFormat}`,{ responseType : 'blob' as 'json', observe : 'response'} );
  }

  exportAssignedTasksReport( id : number , format :string ){
    const headers = new HttpHeaders();
    headers.set('Accept', 'application/octet-stream');
    return this.httpClient.get<any> (`http://localhost:8080/api/users/${id}/reportAssignedTasks?format=${format}`,{ responseType : 'blob' as 'json', observe : 'response'});
  }
  getTaskCardByBoardIdAndTaskCardId(boardId: number, taskCardId: number):Observable<TaskCard> {
    return this.httpClient.get<TaskCard>(`http://localhost:8080/api/boards/${boardId}/task-cards?id=${taskCardId}`);
}
  
}
