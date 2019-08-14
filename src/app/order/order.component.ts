import {Component, OnInit, ViewChild} from '@angular/core';
import {OrderService} from './order.service';
import {Order} from './order';
import {MatTable} from '@angular/material';
import {Item} from '../catalog/item';
import {Merchant} from '../member/merchant';

@Component({
  selector: 'app-order',
  templateUrl: 'order.component.html',
  styleUrls: [
    'order.component.css',
  ]
})
export class OrderComponent implements OnInit {
  // @ViewChild(MatTable, {static: false}) table: MatTable<Element>;
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
