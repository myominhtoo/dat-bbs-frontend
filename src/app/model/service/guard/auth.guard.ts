import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../http/auth.service";

@Injectable({
    providedIn : 'root'
})
export class AuthGuard implements CanActivate {

    constructor( private authService : AuthService , private router : Router ){}

    canActivate(  route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const isAuth = this.authService.isAuth();

        if( !isAuth ){
            this.router.navigateByUrl( '/login?status=Please login to continue!');
            return false;
        }

        return isAuth;
    }

}