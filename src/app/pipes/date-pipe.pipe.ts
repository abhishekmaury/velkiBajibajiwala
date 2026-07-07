import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'datePipe',
  pure : false
})
export class DatePipePipe implements PipeTransform {
  transform(inputDate: any): any {
    if (!inputDate) {
      return '';
    }

    let today = moment().startOf('day');
    let tomorrow = moment().add(1, 'day').startOf('day');
    let afterTomorrow = moment().format('MM/DD/YYYY HH:mm:ss')
    let inputMoment = moment(inputDate).startOf('day');

    if (inputMoment.isSame(today)) {
      return `Today ${moment(inputDate).format('hh:mm A')}`;
    } else if (inputMoment.isSame(tomorrow)) {
      return `Tomorrow ${moment(inputDate).format('hh:mm A')}`;
    } else if(inputMoment.isAfter(afterTomorrow)){
      return inputDate;
    }
  }

}
