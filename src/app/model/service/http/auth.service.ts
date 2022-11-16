import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
    providedIn : 'root'
})
export class AuthService {

    private jwtHelpersService = new JwtHelperService();
    
    saveToken( token : string ){
        localStorage.setItem(window.btoa('token'),`Penta ${token}`);
    }

    getToken(){
        return localStorage.getItem(window.btoa('token'));
    }

    isAuth( token : string ) : boolean {
       return  !this.jwtHelpersService.isTokenExpired( token ) && this.jwtHelpersService.decodeToken(token);
    }

    test( token : string ){
        console.log(this.jwtHelpersService.decodeToken(token))
    }

}