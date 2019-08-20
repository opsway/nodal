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
  nowDate: string;
  nowTime: string;
  constructor(
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.now = this.setVirtualDate();
    this.update();
    this.updateVirtualDate();
  }

  update = () => {
    const date = this.now.split('T');
    this.nowDate = date[0];
    this.nowTime = date[1];
  }

  setVirtualDate = () => this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');

  updateVirtualDate = () => {
    console.log(`${this.nowDate}T${this.nowTime}`);
    console.log(this.now);
    const diff = Date.now() - (new Date(`${this.nowDate}T${this.nowTime}`)).getTime();
    localStorage.setItem('virtual_date_diff', `${diff || 0}`);
  }
}
