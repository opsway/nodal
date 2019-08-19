import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-time-and-date',
  templateUrl: './time-and-date.component.html',
  providers: [
    DatePipe,
  ]
})
export class TimeAndDateComponent implements OnInit {
  now: string;
  constructor(
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.now = this.setVirtualDate();
    this.updateVirtualDate();
  }

  private setVirtualDate = () => this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  private updateVirtualDate = () => {
    const diff = Date.now() - (new Date(this.now)).getTime();
    localStorage.setItem('virtual_date_diff', `${diff || 0}`);
  }
}
