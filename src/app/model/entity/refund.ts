import * as Util from '../../util/util';
import { Entity } from './entity';
import { Payment } from './payment';
import { Collection } from '../collection';
import { OrderItem } from './order/order-item';

export class Refund implements Entity {
  id: string;
  settledAt: Date = null;
  status: string;
  orderItems: Collection<OrderItem> = new Collection<OrderItem>();

  constructor(
    public payment: Payment,
    public createdAt: Date,
    public total: number = 0,
  ) {
    this.id = Util.uuid('R');
  }

  get isCaptured(): boolean {
    return this.settledAt !== null;
  }

  get gateway(): string {
    return this.payment.gateway;
  }

  get orderId(): string {
    return this.payment.order.id;
  }

  get method(): string {
    return this.payment.gateway;
  }

  attacheOrderItem(orderItem: OrderItem): this {
    this.increment(orderItem.total)
      .orderItems.add(orderItem);

    return this;
  }

  private increment(amount: number): this {
    this.total += amount;

    return this;
  }

  capture(settlementDate: Date): this {
    this.settledAt = settlementDate;

    return this;
  }
}
