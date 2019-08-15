import {Component, OnInit, ViewChild} from '@angular/core';
import {Item} from './model/item/item';
import {OrderItem} from './model/order-item/order-item';
import {Seller} from './model/member/seller/seller';
import {Order} from './model/order/order';

import {ItemService} from './model/item/item.service';
import {PaymentService} from './model/payment/payment.service';
import {OrderComponent} from './ui/order/order.component';
import {ActivatedRoute} from '@angular/router';
import {Payment} from './model/payment/payment';

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
    private route: ActivatedRoute,
    item: ItemService,
    payment: PaymentService,
  ) {
    this.item = item;
    this.payment = payment;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.import(params.get('data')); // TODO handling false
    });
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

  import(content: string): boolean {
    let data = null;
    try {
      data = JSON.parse(atob(content));
    } catch (e) {
      return false;
    }

    console.log(data); // TODO import model

    return true;
  }

  export(data: Payment[]): string {
    const content = JSON.stringify({count: data.length}); // TODO export model
    return `${window.location.origin}/${btoa(content)}`;
  }

  save(): void {
    const url = this.export(this.payment.all());
    console.log(url);
    window.location.href = url;
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
