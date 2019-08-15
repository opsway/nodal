import * as Util from '../../util/util';
import {Order} from '../order/order';
import {Model} from '../model';

export class Payment {
  id: string;
  createdAt: Date;
  order: Order;
  status: string;
  gateway: string;
  feeGateway = 0;

  constructor(
    order: Order,
    gateway: string,
  ) {
    this.id = Util.uuid('P');
    this.createdAt = new Date();
    this.order = order;
    this.status = 'created';
    this.gateway = gateway;
    order.attachePayment(this);
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
    this.feeGateway = Math.floor((Model.feeGatewayPercent / 100) * this.amount);
    this.status = 'captured';
  }
}
