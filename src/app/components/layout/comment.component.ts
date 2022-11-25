import { Component , EventEmitter, Input, OnInit, Output  } from "@angular/core";
import { Comment } from "src/app/model/bean/comment";
import { TaskCard } from "src/app/model/bean/taskCard";
import { CommentService } from "src/app/model/service/http/comment.service";
import { CommentStore } from "src/app/model/service/store/comment.store";
import { UserStore } from "src/app/model/service/store/user.store";
import swal from "sweetalert";

@Component({
    selector : 'comment',
    templateUrl : `./comment.component.html`
})
export class CommentComponent implements OnInit {

    isReplying : boolean = false;
    showChilds : boolean = true;
    newComment : Comment = new Comment();
    isEditing : boolean = false;
    tempComment : string = '';
    childComments : Comment [] =[];
    
    @Input('comment') comment = new Comment();
    @Input('task') task = new TaskCard();
    
    @Output('leave-family') childLeaveFamily = new EventEmitter<Comment>();
    
    constructor( 
         public userStore : UserStore ,
         private commentService : CommentService ,
         public commentStore : CommentStore
    ){
        this.userStore.fetchUserData();
    }

    ngOnInit(): void {
        this.newComment.comment = '';
        this.comment.childComments = [];
        const childComments = this.commentStore.commentsMap.get(this.task.id)?.get(this.comment.id);
        this.comment.childComments = childComments == undefined ? [] : childComments;    
    }

    controlReplying( status : boolean ){
        this.isReplying = status;
    }

    controlEditing( status : boolean ){
        if( !this.commentStore.canEdit && status  ) return;
        this.isEditing = status;
        this.commentStore.canEdit = !status;
        if( status ) this.tempComment = this.comment.comment;
        else this.comment.comment = this.tempComment;
    }

    handleReplySubmit(){
        this.userStore.fetchUserData();
        this.newComment.user = this.userStore.user;
        this.newComment.taskCard = this.task;
        this.newComment.parentComment = this.comment;

        this.commentService.createComment( this.newComment )
        .subscribe({
            next : res => {
               if( res.ok ){
                this.isReplying = false;
                res.data.childComments = [];
                this.comment.childComments.unshift(res.data);
                this.newComment.comment = '';
               }
            },
            error : err => {
                console.log(err);
            }
        });
       
    }

    toggleShowChilds(){
        this.showChilds = !this.showChilds;
    }


    handleUpdateComment(){
        this.commentService.updateComment( this.comment )
        .subscribe({
            next : res => {
                if( res.ok ){
                   this.isEditing = false;
                   this.commentStore.canEdit = true;
                }
            },  
            error : err => {
                this.comment.comment = this.tempComment;
                console.log(err);
            }
        });
    }


    handleLeaveFamily( comment : Comment ){
        this.comment.childComments = this.comment.childComments.filter( cmt => cmt.id != comment.id );
    }


    handleDeleteClick(){
        swal({
            text : 'Are you sure to delete this comment?',
            icon : 'warning',
            buttons : [ 'No' , 'Yes' ]
        }).then( isYes => {
            if(isYes){
                this.commentService.deleteComment( this.comment.id )
                .subscribe({
                    next : res => {
                        if( res.ok ){
                            /*
                            if is just for single 
                            else is for to leave from siblings comments
                            */
                            if( this.comment.parentComment == null ){
                               this.task.comments = this.task.comments.filter( cmt => cmt.id != this.comment.id );
                               this.comment.childComments = [];
                            }else{
                                this.childLeaveFamily.emit(this.comment);
                            }
                        }
                    },
                    error : err => {
                        console.log(err);
                    }
                });
            }
        });
    }

}