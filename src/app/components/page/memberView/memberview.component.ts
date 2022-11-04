import { Component } from "@angular/core";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { ActivatedRoute, Route, Router } from "@angular/router";


@Component({
  selector : "memberview",
  templateUrl : "./memberview.component.html"
})

export  class MemberviewComponent{

  user:User=new User();
  imgValue:any=null;


  constructor(
    private userService : UserService,
    private router: Router,
    public route : ActivatedRoute

  ){
   let profileId=this.route.snapshot.params['id'];
   console.log(profileId);
  this.userService.getUser(profileId).subscribe(data=>{
    this.user=data;
  })
}

}
