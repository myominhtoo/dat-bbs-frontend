import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import PUBLIC_URL from "../../constant/http";
import { AuthService } from "../http/auth.service";

@Injectable({
    providedIn : 'root'
})
export class AuthInterceptor implements HttpInterceptor{

    constructor( private authService : AuthService ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       let requestUrl = req.url.replace("http://localhost:8080","");
       if( requestUrl.includes('?')){
        requestUrl = requestUrl.split('?')[0];
       }
       if( PUBLIC_URL.includes(requestUrl.trim()) ){
         return next.handle(req);
       }  
       const token =this.authService.getToken();
       const request = req.clone({ setHeaders : {
        'Authorization' : token
       }});
       return next.handle(request);
    }

    
}