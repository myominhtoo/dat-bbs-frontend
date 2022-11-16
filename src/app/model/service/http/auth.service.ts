import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
    providedIn : 'root'
})
export class AuthService {

    private _token : string = "";

    private jwtHelpersService = new JwtHelperService();
    
    saveToken( token : string ){
        this._token = token;
        localStorage.setItem(window.btoa('token'),`${token}`);
    }

    private loadToken(){
        const savedToken = localStorage.getItem(window.btoa('token'));
        this._token =  savedToken == null ? '' :  savedToken;
    }

    isAuth() : boolean {
       this.loadToken();
       return  !this.jwtHelpersService.isTokenExpired( this._token ) && this.jwtHelpersService.decodeToken(this._token).data.length == 2;
    }

    getToken(){
        this.loadToken();
        return this._token;
    }

    test( token : string ){
        console.log(this.jwtHelpersService.decodeToken(token))
    }

}