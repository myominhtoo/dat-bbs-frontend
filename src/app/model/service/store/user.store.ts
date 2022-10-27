import { Injectable } from "@angular/core";
import { decode, encode } from "src/app/util/encoder";
import { User } from "../../bean/user";

@Injectable({
    providedIn : 'root'
})
export class UserStore{
    user : User = new User();
    
    constructor(){}

    fetchUserData(){
       let savedUser = decode(localStorage.getItem(window.btoa('user')));
       if( savedUser != null ){
        this.user.id = savedUser.id;
        this.user.username = savedUser.username;
        this.user.imageUrl = savedUser.imageUrl;
       }
    }


    saveUserData( user : User ){
        localStorage.setItem(window.btoa(('user')),encode({id : user.id  , username : user.username , imageUrl : user.imageUrl}));
        this.fetchUserData();
    }

}