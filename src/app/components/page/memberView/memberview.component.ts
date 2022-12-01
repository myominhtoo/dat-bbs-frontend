import { Component, OnInit } from "@angular/core";
import { User } from "src/app/model/bean/user";
import { UserService } from "src/app/model/service/http/user.service";
import { ActivatedRoute, Route, Router } from "@angular/router";


@Component({
  selector : "memberview",
  templateUrl : "./memberview.component.html"
})

export  class MemberviewComponent implements OnInit {

  user:User=new User();
  imgValue:any=null;


  constructor(
    private userService : UserService,
    public route : ActivatedRoute
  ){

  }

  ngOnInit(): void {
    let profileId=this.route.snapshot.params['id'];
    this.getData( profileId )
  }

  getData( profileId : number ){
    this.userService.getUser(profileId).subscribe(data=>{
      this.user=data;
    })
  }


}
