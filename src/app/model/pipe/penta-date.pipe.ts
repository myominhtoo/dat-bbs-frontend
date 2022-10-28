import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name : 'pentaDate'
})
export class PentaDatePipe implements PipeTransform {
    transform(value: any) {
       console.log(value)
        return value;
    }
}
