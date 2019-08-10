import * as Util from './util';
import {Order} from './order';
import {OrderItem} from './order-item';

const feeGatewayPercent = 2.1;

export class Payment {
  id: string;
  order: Order;
  status: string;
  feeGateway = 0;

  constructor(order: Order) {
    this.id = Util.uuid('P');
    this.order = order;
    this.status = 'created';
    order.items.forEach((item: OrderItem) => {
      item.payment = this;
    });
  }

  get total(): number {
    return this.order.amount - this.feeGateway;
  }

  get totalMarket(): number {
    return this.order.feeMarket - this.feeGateway;
  }

  get amount(): number {
    return this.order.amount;
  }

  get feeMarket(): number {
    return this.order.feeMarket;
  }

  get captured(): boolean {
    return this.status === 'captured';
  }

  capture(): void {
    this.feeGateway = Math.floor((feeGatewayPercent / 100) * this.amount);
    this.status = 'captured';
  }
}
