import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, observable } from "rxjs";
import { HttpResponse } from "../../bean/httpResponse";
import { User } from "../../bean/user";

@Injectable({
    providedIn : 'root'
})

export class UserService {
    constructor ( private httpClient : HttpClient ){
    }

    sendVerification(email : string) : Observable <HttpResponse> {
        return this.httpClient.get<HttpResponse>(`http://localhost:8080/api/send-verification?email=${email}`);

    }

    sendRegisteration( user : User ) : Observable <HttpResponse> {
        return this.httpClient.post <HttpResponse> (`http://localhost:8080/api/register` ,  user);
    }
}