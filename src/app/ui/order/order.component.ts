import {
  Component,
  OnInit,
} from '@angular/core';
import {OrderService} from '../../model/order/order.service';
import {PaymentService} from '../../model/payment/payment.service';

@Component({
  selector: 'app-order',
  templateUrl: 'order.component.html',
  styleUrls: [
    'order.component.css',
  ]
})
export class OrderComponent implements OnInit {
  order: OrderService;
  payment: PaymentService;
  displayedColumns: string[] = [
    'id',
    'createdAt',
    'customerId',
    'status',
    'action',
  ];

  constructor(
    order: OrderService,
    payment: PaymentService,
  ) {
    this.order = order;
    this.payment = payment;
  }

  ngOnInit() {
  }
}
