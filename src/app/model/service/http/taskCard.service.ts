import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpResponse } from "../../bean/httpResponse";
import { TaskCard } from "../../bean/taskCard";

export class TaskCardService {
    constructor ( private httpClient : HttpClient ){
    }
    createTaskCard( taskCard : TaskCard ) : Observable <HttpResponse>{
        return this.httpClient.post<HttpResponse> (`http://localhost:8080/api/create-task` , taskCard);
    }

    getTaskCards( boardId : number ) : Observable<TaskCard[]> {
        return this.httpClient.get<TaskCard[]>(`http://localhost:8080/api/boards/${boardId}/task-cards`);
    }
}