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



  constructor(private attachmentService : AttachmentService,  public route: ActivatedRoute ) {

    this.attachmentService=attachmentService;
    this.route=route;
   }

  ngOnInit(): void {

   this.getAttachmentList();

  }

  getAttachmentList(){

    const boardId=this.route.snapshot.params['id'];
    console.log(boardId);

    this.attachmentService.getAttachmentList(boardId).subscribe(data=>{
            this.attachment=data;
    })



  }



























  deleteAttachment(att: Attachment) {}
  //     swal({
  //         text: 'Are you sure to Delete?',
  //         icon: 'warning',
  //         buttons: ['No', 'Yes ']
  //     }).then(isYes => {
  //         if (isYes) {
  //             this.attachmentService.deleteAttachment(att.id).subscribe(data => {
  //                 this.attachments = this.attachments.filter(attachment => attachment.id != att.id);
  //                 this.totalPagesOfAttachments = Math.ceil(this.attachments.length / this.MAX_ITEM_PER_PAGE);
  //                 this.handleAssignPaginatedAttachments(this.totalPagesOfAttachments > 1 ? this.curPageOfAttachments : 1);

  //                 const noti = new Notification();
  //                 noti.content = `${this.userStore.user.username} deleted attachment in \n ${this.detailActivity.activityName} activity of ${this.detailActivity.activityName} Task Card in ${this.board.boardName} Board `;
  //                 noti.sentUser = this.userStore.user;
  //                 noti.board = this.board;

  //                 this.socketService.sentNotiToBoard(this.board.id, noti);

  //             });
  //         }
  //     })
  // }


  // handleAddAttachment() {
  //     const inputFiles = ($('#attachment')[0] as HTMLInputElement).files;
  //     if (inputFiles?.length == 0 || !this.newAttachment.name) {
  //         if (!this.newAttachment.name) this.newAttachment.name = '';
  //         if (inputFiles?.length == 0) this.status.attachmentError = 'Attachment file is required!'
  //     } else {
  //         this.status.attachmentError = '';
  //         this.newAttachment.file = inputFiles![0];
  //         this.newAttachment.user = this.userStore.user;
  //         this.newAttachment.activity = this.detailActivity;

  //         this.status.addingAttachment = true;
  //         this.attachmentService.addAttachmentToActivity(this.newAttachment)
  //             .subscribe({
  //                 next: res => {
  //                     this.status.addingAttachment = false;
  //                     if (res.ok) {
  //                         swal({
  //                             text: 'Successfully Uploaded!',
  //                             icon: 'success'
  //                         }).then(() => {
  //                             $('#close-attachment-btn').click();
  //                             const resAttachment = res.data;
  //                             resAttachment.user = this.newAttachment.user;
  //                             this.attachments.push(resAttachment);
  //                             this.totalPagesOfAttachments = Math.ceil(this.attachments.length / this.MAX_ITEM_PER_PAGE);
  //                             this.handleAssignPaginatedAttachments(this.totalPagesOfAttachments > 1 ? this.curPageOfAttachments + 1 : 1);
  //                             this.newAttachment = new Attachment();

  //                             const noti = new Notification();
  //                             noti.content = `${this.userStore.user.username} uploaded attachment in \n ${this.detailActivity.activityName}  Activity of ${this.detailActivity.taskCard.taskName} Task in ${this.board.boardName} Board `;
  //                             noti.sentUser = this.userStore.user;
  //                             noti.board = this.board;

  //                             this.socketService.sentNotiToBoard(this.board.id, noti);

  //                             $('#attachment').val('');
  //                         })
  //                     }
  //                 },
  //                 error: err => {
  //                     this.status.addingAttachment = false;
  //                     this.status.attachmentError = err.error.message;
  //                 }
  //             });

  //     }
  // }



}
