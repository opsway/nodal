import {
  Component,
  OnInit,
} from '@angular/core';
import {OrderService} from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: 'order.component.html',
  styleUrls: [
    'order.component.css',
  ]
})
export class OrderComponent implements OnInit {
  order: OrderService;
  displayedColumns: string[] = [
    'id',
    'customer',
    'amount',
    'amountShipping',
    'feeMarket',
    'total',
    'status',
  ];

  constructor(
    order: OrderService,
  ) {
    this.order = order;
  }

  ngOnInit() {
  }
}
