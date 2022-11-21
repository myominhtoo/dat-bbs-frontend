import { Injectable } from "@angular/core";
import { decode, encode } from "src/app/util/encoder";
import { User } from "../../bean/user";
import { COLORS } from "../../constant/colors";

@Injectable({
    providedIn : 'root'
})
export class UserStore{
    user : User = new User();
    togglepass!:boolean;
    
    constructor(){}

    fetchUserData(){
       let savedUser = decode(localStorage.getItem(window.btoa('user')));
       if( savedUser != null ){
        this.user.id = savedUser.id;
        this.user.username = savedUser.username;
        this.user.imageUrl = savedUser.imageUrl;
        this.user.email = savedUser.email;
        this.user.iconColor = savedUser.iconColor;
       }
    }

    saveUserData( user : User ){
        localStorage.setItem(window.btoa(('user')),encode({id : user.id , email : user.email  , username : user.username , imageUrl : user.imageUrl , iconColor : user.iconColor ? user.iconColor : COLORS[ Math.floor( Math.random() * (COLORS.length -1 ))] }));
        this.fetchUserData();
    }
    togglePassword(){       
        this.togglepass=!this.togglepass;
     }
}