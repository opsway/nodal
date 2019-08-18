import {Pipe, PipeTransform} from '@angular/core';
import {Model} from '../model/model';

const formatter = new Intl.NumberFormat(
  Model.locale,
  {
    style: 'currency',
    currency: Model.currency,
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
