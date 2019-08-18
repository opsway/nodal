import {Pipe, PipeTransform} from '@angular/core';
import {Model} from '../model/model';

const formatter = new Intl.NumberFormat(
  'en-EN',
  {
    style: 'currency',
    currency: 'INR',
  },
);

@Pipe({
  name: 'convert'
})
export class ConvertPipe implements PipeTransform {
  transform(value: any): any {
    return formatter.format(value / Model.precisionOfPersist);
  }
}
