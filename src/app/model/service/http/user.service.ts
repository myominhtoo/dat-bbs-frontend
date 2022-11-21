import { BoardBookMark } from './../../bean/BoardBookMark';
import { User } from 'src/app/model/bean/user';
import { HttpClient, HttpHeaders , HttpResponse as NgHttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpResponse } from "../../bean/httpResponse";
import { BoardsHasUsers } from '../../bean/BoardsHasUser';
import { Notification } from '../../bean/notification';


@Injectable({
    providedIn : 'root'
})

export class UserService {

    constructor ( private httpClient : HttpClient ){}

    sendVerification(email : string) : Observable <HttpResponse<any>> {
        return this.httpClient.get<HttpResponse<any>>(`http://localhost:8080/api/send-verification?email=${email}`);
    }

    sendRegisteration( user : User ) : Observable <HttpResponse<any>> {
        return this.httpClient.post <HttpResponse<any>> (`http://localhost:8080/api/register` ,  user);
    }

    LoginUser( user : User ) : Observable <NgHttpResponse<any>> {
        return this.httpClient.post <NgHttpResponse<any>> (`http://localhost:8080/api/login` ,  user , { observe : 'response' });
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

    updateUser(user:User):Observable<NgHttpResponse<any>>{
        return this.httpClient.put<NgHttpResponse<any>>(`http://localhost:8080/api/update-user`,user , { observe : 'response' });
    }

    toggleBookMark(id : number , bookmark : BoardBookMark) :Observable <HttpResponse<BoardBookMark>>{
        return  this.httpClient.post<HttpResponse<BoardBookMark>> (`http://localhost:8080/api/users/${id}/board-bookmark`,bookmark)
    }

    getBookMarks(userId : number): Observable<BoardBookMark[]> {
        return this.httpClient.get<BoardBookMark[]>(`http://localhost:8080/api/users/${userId}/board-bookmarks`);
    }

    delteImage(user:User):Observable<HttpResponse<User>>{
        return this.httpClient.put<HttpResponse<User>>(`http://localhost:8080/api/delete-img`,user);
    }

    forgetPassword(userEmail : string) : Observable<User>{
        return this.httpClient.get<User>(`http://localhost:8080/api/forget-password?email=${userEmail}`);
    }

    changePassword(user : User) : Observable<HttpResponse<User>>{
        return this.httpClient.put<HttpResponse<User>>(`http://localhost:8080/api/change-password`,user)
    }

    getNotificationsForUser( userId : number ) : Observable<Notification[]> {
        return this.httpClient.get<Notification[]>(`http://localhost:8080/api/users/${userId}/notifications`);
    }

    // reportUser(boardId: number ,filetype: string): Observable<Map<string,string>>{
    //   return this.httpClient.get<Map<string,string>>(`http://localhost:8080/api/boards/${boardId}/members/report?format=${filetype}`);
    // }

    exportMember(boardId:number,filetype :string) {
      return this.httpClient.get<any>(`http://localhost:8080/api/boards/${boardId}/members/report?format=${filetype}`);
    }
    getAllMembers(userId:number): Observable<BoardsHasUsers[]>{
        return this.httpClient.get<BoardsHasUsers[]>(`http://localhost:8080/api/users/${userId}/collaborators`);
    }
    getAllJoinedMembers(userId:number): Observable<BoardsHasUsers[]>{
        return this.httpClient.get<BoardsHasUsers[]>(`http://localhost:8080/api/users/${userId}/joinboard`);        
    }
  }
