import {
  Pipe,
  PipeTransform,
} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Model} from '../model/model';

const formatter = new DatePipe('en-US');

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value?: Date): any {
    return value ? formatter.transform(value, Model.dateFormat) : '';
  }
}
