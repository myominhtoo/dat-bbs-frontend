import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name : 'pentaDate'
})
export class PentaDatePipe implements PipeTransform {
  public dateObj : Date =new Date();

     months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec']

    transform(value: any) {
      let [ date , time ] = value.split(' ');
      return this.calculateDiffTime(date,time);
    }


    private calculateDiffTime( date : string ,  time : string ) : string {
      let result = '';
      let [ year , month , day  ] = date.split('-');
      let [ curYear , curMonth , curDay ] = [ this.dateObj.getFullYear() , this.dateObj.getMonth() , this.dateObj.getDate() ];
      let [ hour , min ] = time.split(':');
      let [ curHour , curMin ] = [ this.dateObj.getHours() , this.dateObj.getMinutes() ];

      let hasYearDiff =  curYear - Number(year) >= 1;
      let hasMonthDiff =  (curMonth+1) - Number(month) >= 0;
      let hasDayDiff =  Math.abs( curDay - Number(day)) > 1;
      let dayDiff =  curDay - Number(day);

      result += hasYearDiff ? year+' ' : '';
      result += hasYearDiff || hasMonthDiff ? this.months[Number(month) -1 ] : '';
      result += ` ${day} `;
      result += ( hasYearDiff || hasMonthDiff ) ? ' At ' : '';
      console.log(hasDayDiff)

      if( !hasDayDiff ){

        if( dayDiff == 1 ){
          result = 'Yesterday';
          return result;
        }else{
          if( Number(curHour) - Number(hour) > 1 ){

            let resultHour = Number(curHour) - Number(hour);
            result = `${resultHour}`;
            result += resultHour > 1 ? ' hrs ago' : ' hr ago';
          }else{
            result = `${Number(curMin) - Number(min)}`
            if( Number(result) <= 1 ) return 'Just Now';
            result += Number(curMin) - Number(min) > 1 ? ' mins ago' : ' min ago';
          }
        }
      }else{
        if( hour == '00' || min == '00') result += `01:00`;
        else result += `${ Number(hour) > 12 ? Number(hour) -12 : hour }:${ min }`;
        result += `${ Number(hour) > 12 ? ' P.M' : ' A.M' }`;
        return result;
      }

      return result;
    }
}
