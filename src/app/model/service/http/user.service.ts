import { User } from 'src/app/model/bean/user';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResponse } from "../../bean/httpResponse";


@Injectable({
    providedIn : 'root'
})

export class UserService {
    constructor ( private httpClient : HttpClient ){
    }

    sendVerification(email : string) : Observable <HttpResponse<any>> {
        return this.httpClient.get<HttpResponse<any>>(`http://localhost:8080/api/send-verification?email=${email}`);
    }

    sendRegisteration( user : User ) : Observable <HttpResponse<any>> {
        return this.httpClient.post <HttpResponse<any>> (`http://localhost:8080/api/register` ,  user);
    }

    LoginUser( user : User ) : Observable <HttpResponse<User>> {
        return this.httpClient.post <HttpResponse<any>> (`http://localhost:8080/api/login` ,  user);
    }

    getUsers() : Observable<User[]> {
        return this.httpClient.get<User[]>('http://localhost:8080/api/users');
    }

    getUsersForBoard( boardId : number ) : Observable<User[]> {
        return this.httpClient.get<User[]>( `http://localhost:8080/api/boards/${boardId}/members` );
    }
    uploadPhoto(image:FormData,id:number): Observable<User>{
        
        return this.httpClient.put<User>(`http://localhost:8080/api/users/${id}/upload-image`,image,
        {   
            
            headers:{
                'Content-type':`multipart/form-data; boundary=${image}`
                    }
    
    }
        )
    }

}