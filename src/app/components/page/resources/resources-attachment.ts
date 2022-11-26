import { Location } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Attachment } from "src/app/model/bean/attachment";
import { AttachmentService } from "src/app/model/service/http/attachment.service";


@Component({
  selector: 'resources',
  templateUrl : './resources-attachement.html'
})

export class ResourcesAttachmentComponent{

  attachment: Attachment[]=[];
  status = {
    hasDoneFetching : false,
    isLoading : false,
  }

  constructor( 
      private attachmentService : AttachmentService ,
      public route: ActivatedRoute , 
      public location : Location ) {
    this.attachmentService=attachmentService;
    this.route=route;
   }

  ngOnInit(): void {
   this.getAttachmentList();
  }

  getAttachmentList(){
    const boardId=this.route.snapshot.params['id'];
    this.status.isLoading = true;
    this.attachmentService.getAttachmentList(boardId).subscribe(data=>{
            this.attachment=data;
            this.status.hasDoneFetching = true;
            this.status.isLoading = false;
    })
  }
}
