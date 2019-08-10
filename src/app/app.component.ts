import {Component, OnInit} from '@angular/core';
import {Item} from './item';
import {OrderItem} from './order-item';
import {Merchant} from './merchant';
import {Order} from './order';

import {ItemService} from './item.service';
import {PaymentService} from './payment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'modeling nodal workflow';
  merchants: Merchant[] = [];
  order: Order;
  catalog: Array<{item: Item, merchant: Merchant}> = [];
  workflow: Array<CallableFunction> = [];
  total = {
    gateway: {
      amount: 0,
      market: 0,
    },
  };

  constructor(
    private item: ItemService,
    private payment: PaymentService,
  ) {
  }

  ngOnInit(): void {
    this.order = new Order([]);

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

    this.workflow.push(() => {
      this.addToCart(this.item.find('SKU1'), merchantTA);
      this.addToCart(this.item.find('SKU2'), merchantTA);
      this.checkout();
    });
    this.workflow.push(() => {
      this.addToCart(this.item.find('SKU3'), merchantSAAN);
      this.checkout();
    });
    this.workflow.push(() => {
      this.addToCart(this.item.find('SKU4'), merchantTA);
      this.checkout();
    });
    this.workflow.push(() => {
      this.emitGatewaySettlementEvent();
    });
    this.workflow.push(() => {
      this.emitNodalSettlementEvent();
    });
  }

  workflowStepAuto(): void {
    setInterval(() => {
      this.workflowStep();
    }, 2500);
  }

  workflowStep(): void {
    const next = this.workflow.shift();
    if (next) {
      next();
    }
  }

  refund(item: OrderItem): void {
    this.payment.refund(item);
    this.updateTotal();
  }

  addToCart(item: Item, merchant: Merchant): void {
    this.order.add(item, merchant);
  }

  checkout(): void {
    if (this.order.amount > 0) {
      this.payment.checkout(this.order);
      this.order = new Order([]);
      this.updateTotal();
    }
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
