import { BoardBookMark } from './../../../model/bean/BoardBookMark';
import { Component } from "@angular/core";
import { ToggleStore } from "src/app/model/service/store/toggle.service";
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BoardStore } from 'src/app/model/service/store/board.store';
import { BoardBookMarkService } from 'src/app/model/service/http/boardBookmark.service';
import { UserStore } from 'src/app/model/service/store/user.store';
import swal from "sweetalert";

@Component({
    selector :'bookmarks',
    templateUrl : './bookmarks.component.html'
})
export class BoardMarkComponent{
    bookmark: BoardBookMark = new BoardBookMark;
    bookMarks : BoardBookMark[] = [];

    pdf='pdf';
    excel='excel';
    html='html';
    // bookmarks : BoardBookMark[]=[];
    status = {
        isLoading : false,
        hasDoneFetching : false,
    }    

    constructor( public toggleStore : ToggleStore ,
                 public boardStore : BoardStore,
                 private boardBoardmarkService : BoardBookMarkService,
                 public userStore : UserStore){document.title = "BBMS | Bookmarks";}

     drop( e : CdkDragDrop<BoardBookMark[]> ){}

     ngOnInit(): void {
        this.userStore.fetchUserData();
        this.showBookMarks(this.userStore.user.id);
    }

     showBookMarks( userId : number ){
        this.status.isLoading = true;
        this.boardBoardmarkService.showBookmarks(userId).subscribe({
            next: dataBookmark => {
                console.log(dataBookmark);
                this.bookMarks = dataBookmark;
                this.status.isLoading = false;
                this.status.hasDoneFetching = true;
            },
            error : err =>{
                console.log(err);
            } 
        });
     }

     toggleBookMark( boardBookMark : BoardBookMark ){     
       this.bookMarks = this.bookMarks.filter( bookmark => bookmark.id != boardBookMark.id );
    }

    exportBookmarkReport(path:string) {

        let useridd=this.userStore.user.id;

          this.boardBoardmarkService.reportBookMark(useridd,path).subscribe((res)=>{
            const blob = new Blob([res.body], { type : 'application/octet-stream'});
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = `bookMarks.${path=='excel' ? 'xlsx' : path.toLowerCase()}`,
            a.click();
            URL.revokeObjectURL(objectUrl);
              swal({
                  text : 'Successfully Exported!',
                  icon : 'success'
              });
          })
  
        }

}