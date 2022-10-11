import { Component } from "@angular/core";

@Component({
    selector :'create-board',
    templateUrl : './create-board.component.html'
})
export class CreateBoardComponent{
    emailStr :string ='';
    emails : string [] = [];
  
    status = {
      update : {
        idx : 0,
        willUpdate : false
      },
      error : {
        hasError : false,
        msg : ''
      }
    }
    
    onChange( event : KeyboardEvent ){
      let emailStr = this.emailStr;
      let lastChar = emailStr[emailStr.length - 1];
      this.status.error = { hasError : false , msg : ''}
      if( lastChar === ',' || lastChar === ' ' || event.keyCode == 13 ){
        let prevLastChar = emailStr[emailStr.length - 2];
        if( prevLastChar  == ' ' || prevLastChar == ','){
          this.emailStr = prevLastChar == ' ' ? emailStr.trim() : emailStr.replaceAll(',','');
        }
        if(emailStr.includes('@') && emailStr.includes('.')){
         
          this.status.update.willUpdate
          ? this.emails[this.status.update.idx] = emailStr
          : this.emails.push( emailStr.includes(',') ? emailStr.replace(',','') : emailStr.replaceAll(' ',''));
  
          this.status.update = { idx : 0 , willUpdate : false }
          this.emailStr = '';
        }else{
          this.status.error = { hasError : true , msg : 'Invalid email!'}
        }
      }
    }
  
    removeEmail( idx : number ){
      this.emails.splice(idx,1);
    }
  
    setUpdateEmail( idx : number ){
      this.emailStr = this.emails[idx];
      this.status.update = { idx : idx , willUpdate : true }
    }
  }
  