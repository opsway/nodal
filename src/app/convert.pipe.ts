import {Pipe, PipeTransform} from '@angular/core';

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
  transform(value: any, ...args: any[]): any {
    return formatter.format(value / 100);
  }
}
