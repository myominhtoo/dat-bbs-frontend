import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name : 'pentaDate'
})
export class PentaDatePipe implements PipeTransform {
  public dateObj : Date =new Date();

     months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Nov','Dec']

    transform(value: any) {
      let [ date , time ] = value.split(' ');
      console.log(date , time )
      return this.calculateDiffTime(date,time);
    }


    private calculateDiffTime( date : string ,  time : string ) : string {
      let result = '';
      let [ year , month , day  ] = date.split('-');
      let [ curYear , curMonth , curDay ] = [ this.dateObj.getFullYear() , this.dateObj.getMonth() , this.dateObj.getDay() ];
      let [ hour , min ] = time.split(':');
      let [ curHour , curMin ] = [ this.dateObj.getHours() , this.dateObj.getMinutes() ]

      let hasYearDiff =  curYear - Number(year) >= 1;
      let hasMonthDiff =  curMonth - Number(month) >= 1;
      let dayDiff =  curDay - Number(day);

      result += hasYearDiff ? year : '';
      result += hasMonthDiff ? this.months[Number(month)] : '';
      result += ( hasYearDiff || hasMonthDiff ) ? 'at' : '';

      if( (hasYearDiff || hasMonthDiff ) && dayDiff > 1 ){
        result += `${ 24 - Number(hour)}:${ Number(min) < 10 ? '0'+min : min }`;
        return result;
      }else{
        if( dayDiff == 1 ){
          result = 'Yesterday';
          return result;
        }else{
          if( Number(hour) > 1 ){
            result = `${ Number(curHour) - Number(hour)}`;
            result += Number(hour) > 1 ? ' hrs ago' : 'hr ago';
          }else{
            result = `${Number(curMin) - Number(min)}`
            result += Number(min) > 1 ? ' mins ago' : 'min ago';
          }
        }
      }

      return result;
    }
}
