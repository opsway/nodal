import * as Util from '../../util/util';
import { Entity } from './entity';
import { Payment } from '../payment/payment';

export class Refund implements Entity {
  id: string;
  createdAt: Date;
  status: string;

  constructor(
    public payment: Payment,
    public total: number = 0,
  ) {
    this.id = Util.uuid('R');
    this.createdAt = new Date();
  }

  get orderId(): string {
    return this.payment.order.id;
  }

  get method(): string {
    return this.payment.gateway;
  }

  increment(amount: number): Refund {
    this.total += amount;

    return this;
  }
}
