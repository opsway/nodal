import { Component, OnInit } from '@angular/core';
import {OrderService} from '../../model/order/order.service';

@Component({
  selector: 'app-order-item',
  templateUrl: 'order-item.component.html',
  styleUrls: [
    'order-item.component.css',
  ]
})
export class OrderItemComponent implements OnInit {
  orderService: OrderService;
  displayedColumns: string[] = [
    'id',
    'orderId',
    'customerId',
    'sellerName',
    'itemId',
    'price',
    'shipping',
    'qty',
    'amount',
    'amountShipping',
    'total',
    'feeMarket',
  ];
  constructor(
    orderService: OrderService,
  ) {
    this.orderService = orderService;
  }

  ngOnInit() {
  }

}
