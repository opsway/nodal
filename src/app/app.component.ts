import {Component, OnInit, ViewChild} from '@angular/core';
import {Item} from './model/item/item';
import {OrderItem} from './model/order/order-item';
import {Merchant} from './model/member/merchant';
import {Order} from './model/order/order';

import {ItemService} from './model/item/item.service';
import {PaymentService} from './model/payment/payment.service';
import {MatTable} from '@angular/material';
import {OrderComponent} from './ui/order/order.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(OrderComponent, {static: false}) orders: OrderComponent;
  title = 'modeling nodal workflow';
  item: ItemService;
  payment: PaymentService;
  merchants: Merchant[] = [];
  order: Order;
  catalog: Array<{item: Item, merchant: Merchant}> = [];
  total = {
    gateway: {
      amount: 0,
      market: 0,
    },
  };

  constructor(
    item: ItemService,
    payment: PaymentService,
  ) {
    this.item = item;
    this.payment = payment;
  }

  ngOnInit(): void {

    const merchantTA = new Merchant('TA');
    this.merchants.push(merchantTA);
    const merchantSAAN = new Merchant('SAAN');
    this.merchants.push(merchantSAAN);

    this.catalog.push({
      item: this.item.find('SKU1'),
      merchant: merchantTA,
    });
    this.catalog.push({
      item: this.item.find('SKU2'),
      merchant: merchantSAAN,
    });
    this.catalog.push({
      item: this.item.find('SKU3'),
      merchant: merchantSAAN,
    });
    this.catalog.push({
      item: this.item.find('SKU4'),
      merchant: merchantTA,
    });
  }

  refund(item: OrderItem): void {
    this.payment.refund(item);
    this.updateTotal();
  }

  emitGatewaySettlementEvent(): void {
    this.payment.gatewaySettlement();
    this.updateTotal();
  }

  emitNodalSettlementEvent(): void {
    this.payment.nodalSettlement();
    this.updateTotal();
  }

  updateTotal(): void {
    const total = this.payment.total();
    this.total.gateway.amount = total.amount;
    this.total.gateway.market = total.market;
  }
}
