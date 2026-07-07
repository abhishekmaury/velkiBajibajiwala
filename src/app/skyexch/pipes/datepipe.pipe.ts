import { Pipe, PipeTransform } from '@angular/core';
import  moment from 'moment';

@Pipe({
  name: 'DatePipe',
  standalone: true
})
export class DatePipePipe implements PipeTransform {

  transform(inputDate: any): any {
    if (!inputDate) {
      return '';
    }

    let today = moment().startOf('day');
    let tomorrow = moment().add(1, 'day').startOf('day');
    let afterTomorrow = moment().format('MM/DD/YYYY HH:mm')
    let inputMoment = moment(inputDate).startOf('day');

    if (inputMoment.isSame(today)) {
      return `Today ${moment(inputDate).format('HH:mm')}`;
    } else if (inputMoment.isSame(tomorrow)) {
      return `${moment(inputDate).format('MMM DD HH:mm')}`;
    } else if(inputMoment.isAfter(afterTomorrow)){
      return inputDate;
    }
  }

}
