import { Injectable} from '@angular/core';

@Injectable({
    providedIn : 'root',
})
export class TestService{
    count = 10;

    increment(){
          this.count++;
    }
      
        decrement(){
          this.count--;
        }
}