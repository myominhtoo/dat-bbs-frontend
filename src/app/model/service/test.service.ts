import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import {  Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class TestService{

    constructor(private http:HttpClient){}


// test:string[]=["zayar@gmail.com","a@gmail.com","b@gmail.com"]

    getData() : Observable<any[]>{
        return this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
        
        ;
    }
}