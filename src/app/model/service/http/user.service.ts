import { User } from 'src/app/model/bean/user';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResponse } from "../../bean/httpResponse";
import { BoardsHasUsers } from '../../bean/BoardsHasUser';


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
        return this.httpClient.post <HttpResponse<User>> (`http://localhost:8080/api/login` ,  user);
    }

    getUsers() : Observable<User[]> {
        return this.httpClient.get<User[]>('http://localhost:8080/api/users');
    }

    getUsersForBoard( boardId : number ) : Observable<BoardsHasUsers[]> {
        return this.httpClient.get<BoardsHasUsers[]>( `http://localhost:8080/api/boards/${boardId}/members` );
    }

    uploadPhoto(image:File,id:number): Observable<HttpResponse<User>>{

        const data = new FormData();
        data.append( 'file' , image );

        const headers = new HttpHeaders();
        headers.set('Content-Type','multipart/form-data');

        return this.httpClient.post<HttpResponse<User>>(`http://localhost:8080/api/users/${id}/upload-image`, data ,{ headers  } );
    }

    getUser( userId : number ) : Observable<User> {
        return this.httpClient.get<User>(`http://localhost:8080/api/users/${userId}`);
    }

    updateUser(user:User):Observable<HttpResponse<User>>{
        return this.httpClient.put<HttpResponse<User>>(`http://localhost:8080/api/update-user`,user);
    }

    toggleBookMark(id : number , user : User) :Observable <HttpResponse<User>>{
        return  this.httpClient.post<HttpResponse<User>> (`http://localhost:8080/api/users/${id}/board-boardmask`,user)
    }

    getBookMark(userId : number): Observable<User> {
        return this.httpClient.get<User>(`http://localhost:8080/api/users/${userId}/board-bookmarks`);
    }
    

}
