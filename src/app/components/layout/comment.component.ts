import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
    childComments : Comment[] = [];
    
    @Input('comment') comment = new Comment();
    @Input('task') task = new TaskCard();
    
    @Output('edit') updateCommentEmit = new EventEmitter<Comment>();
    @Output('delete') deleteCommentEmit = new EventEmitter<Comment>();

    @Output('edit-child') updateChildCommentEmit = new EventEmitter<Comment>();
    @Output('delete-child') deleteChildCommentEmit = new EventEmitter<Comment>();


    constructor( 
         public userStore : UserStore ,
         private commentService : CommentService ,
         private commentStore : CommentStore
    ){
        this.userStore.fetchUserData();
    }

    ngOnInit(): void {
        this.newComment.comment = '';
        const childComments = this.commentStore.commentsMap.get(this.task.id)?.get(this.comment.id);
        this.comment.childComments = childComments == undefined ? [] : childComments;
    }

    controlReplying( status : boolean ){
        this.isReplying = status;
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

    handleEditClick(){
        if( this.comment.parentComment == null ){
            console.log('hello')
            this.updateCommentEmit.emit(this.comment);
        }else{
            this.updateChildCommentEmit.emit(this.comment);
        }
    }

    handleDeleteClick(){
        if( this.comment.parentComment == null ){
            this.deleteCommentEmit.emit(this.comment);
        }else{
            this.deleteChildCommentEmit.emit(this.comment);
        }
    }

    // updateComment( comment : Comment ){
    //     this.updateCommentEmit.emit(comment);
    //     $("#editComment").click();
    // }

    // deleteComment( comment : Comment ){
    //     console.log(this.comment)
        // swal({
        //     text : 'Are you sure to delete this comment?',
        //     icon : 'warning',
        //     buttons : ['No','Yes']
        // }).then( isYes => {
        //     if(isYes){
        //         this.commentService.deleteComment(this.comment.id)
        //         .subscribe( res => {
        //             if(res.ok){
        //                 this.comment.childComments = this.comment.childComments.filter( childComment => childComment.id != this.comment.id );
        //             }
        //         });
        //     }
        // })
    // }

}