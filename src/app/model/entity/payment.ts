import * as Util from '../../util/util';
import { Order } from '../order/order';
import { Model } from '../model';
import { Collection } from '../collection';
import { Refund } from './refund';
import { Settlement } from './settlement';

export class Payment {
  static STATUS_CAPTURED = 'captured';
  static STATUS_CREATED = 'created';

  id: string;
  settledAt: Date;
  status: string;
  amount = 0;
  feeGateway = 0;
  private refundCollection: Collection<Refund> = new Collection<Refund>();

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

  get totalSettlement(): number {
    return this.amount - this.totalRefund;
  }

  get totalRefund(): number {
    return this.refundCollection.reduce((entity, acc) => acc + entity.total, 0);
  }

  get countRefund(): number {
    return this.refundCollection.count();
  }

  get totalMarket(): number {
    return this.order.feeMarket - this.feeGateway;
  }

  get feeMarket(): number {
    return this.order.feeMarket;
  }

  get isCaptured(): boolean {
    return this.status === Payment.STATUS_CAPTURED;
  }

  // ACTION

  attacheRefund(refund: Refund): Payment {
    this.refundCollection.add(refund);

    return this;
  }

  capture(feeGateway: number, settlementDate: Date = new Date()): Payment {
    this.feeGateway = feeGateway;
    this.settledAt = settlementDate;
    this.status = Payment.STATUS_CAPTURED;
    return this;
  }
}
