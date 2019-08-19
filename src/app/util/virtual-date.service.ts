import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VirtualDateService {

  private toDateString(date: Date): string {
    return (date.getFullYear().toString() + '-'
      + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
      + ('0' + (date.getDate())).slice(-2))
      + 'T' + date.toTimeString().slice(0, 8);
  }
  constructor() { }

  getDate = (): Date => new Date(Date.now() - parseInt(localStorage.getItem('virtual_date_diff'), 10));

  getValue = (): string => this.toDateString(this.getDate());
}
