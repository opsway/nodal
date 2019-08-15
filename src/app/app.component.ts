import {Component, OnInit, ViewChild} from '@angular/core';
import {Item} from './model/item/item';
import {OrderItem} from './model/order-item/order-item';
import {Seller} from './model/member/seller/seller';
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
  sellers: Seller[] = [];
  order: Order;
  catalog: Array<{item: Item, seller: Seller}> = [];
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

    const sellerTA = new Seller('TA');
    this.sellers.push(sellerTA);
    const sellerSAAN = new Seller('SAAN');
    this.sellers.push(sellerSAAN);

    this.catalog.push({
      item: this.item.find('SKU1'),
      seller: sellerTA,
    });
    this.catalog.push({
      item: this.item.find('SKU2'),
      seller: sellerSAAN,
    });
    this.catalog.push({
      item: this.item.find('SKU3'),
      seller: sellerSAAN,
    });
    this.catalog.push({
      item: this.item.find('SKU4'),
      seller: sellerTA,
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
