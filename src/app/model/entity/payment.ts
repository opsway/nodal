import * as Util from '../../util/util';
import { Order } from './order/order';
import { Refund } from './refund';
import { Entity } from './entity';
import { OrderByDate } from './order-by-date';

export class Payment implements Entity, OrderByDate {
  static STATUS_CAPTURED = 'captured';
  static STATUS_CREATED = 'created';

  id: string;
  settledAt: Date;
  status: string;
  amount = 0;
  totalRefund = 0;
  feeGateway = 0;

  constructor(
    public order: Order,
    public gateway: string,
    public createdAt = new Date()
  ) {
    this.id = Util.uuid('P');
    this.settledAt = null;
    this.status = Payment.STATUS_CREATED;
    this.amount = this.order.amountPayable;
  }

  get isRefundable(): boolean {
    return this.amount > this.totalRefund;
  }

  get orderId(): string {
    return this.order.id;
  }

  get total(): number {
    return this.amount - this.feeGateway;
  }

  get feeMarket(): number {
    return this.order.feeMarket;
  }

  get isCaptured(): boolean {
    return this.settledAt !== null;
  }

  // ACTION

  refund(refund: Refund): Payment {
    this.totalRefund += refund.total;
    this.amount -= refund.total;

    return this;
  }

  capture(feeGateway: number, settlementDate: Date = new Date()): Payment {
    this.feeGateway = feeGateway;
    this.settledAt = settlementDate;
    this.status = Payment.STATUS_CAPTURED;

    return this;
  }
}
