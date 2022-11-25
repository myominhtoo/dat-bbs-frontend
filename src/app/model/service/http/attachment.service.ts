import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Attachment } from '../../bean/attachment';
import { Observable } from 'rxjs';
import { HttpResponse } from '../../bean/httpResponse';

@Injectable({
    providedIn : 'root'
})
export class AttachmentService{

    constructor( private httpClient : HttpClient ){}

    public addAttachmentToActivity( attachment : Attachment ) : Observable<HttpResponse<Attachment>> {

        const formData = new FormData();
        formData.append( "file" , attachment.file );
        formData.append( "data" , JSON.stringify(
            { "name" : attachment.name ,
              "user" : { "id" : attachment.user.id } ,
              "activity" : { "id" : attachment.activity.id }
            }) );

        const headers = new HttpHeaders();
        headers.set('Content-Type','multipart/form-data');

        return this.httpClient.post<HttpResponse<Attachment>>(`http://localhost:8080/api/activities/${attachment.activity.id}/create-attachment` , formData , {
            headers
        } );
    }

    public getAttachmentsForActivity( activityId : number ) : Observable<Attachment[]> {
        return this.httpClient.get<Attachment[]>(`http://localhost:8080/api/activities/${activityId}/attachments`);
    }

    public deleteAttachment ( attachmentId : number ) : Observable<HttpResponse<Attachment>> {
        return this.httpClient.delete<HttpResponse<Attachment>>(`http://localhost:8080/api/attachments/${attachmentId}`);
    }

    public getAttachmentList(boardId : number):Observable<Attachment[]>{
return this.httpClient.get<Attachment[]>(`http://localhost:8080/api/boards/${boardId}/attachment-list`);
    }
}
