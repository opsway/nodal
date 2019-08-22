import { Injectable } from '@angular/core';
import * as Util from './util';

@Injectable({
  providedIn: 'root'
})
export class VirtualDateService {
  getDate = (): Date => new Date(Date.now() - parseInt(localStorage.getItem('virtual_date_diff'), 10));

  getValue = (): string => Util.dateToString(this.getDate());
}
