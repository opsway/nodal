import * as Util from '../../util/util';
import {Order} from '../order/order';
import {Model} from '../model';
import {Collection} from '../collection';
import {Refund} from '../entity/refund';

export class Payment {
  id: string;
  createdAt: Date;
  settledAt: Date;
  order: Order;
  status: string;
  gateway: string;
  feeGateway = 0;
  private refundCollection: Collection<Refund> = new Collection<Refund>();

  constructor(
    order: Order,
    gateway: string,
  ) {
    this.id = Util.uuid('P');
    this.createdAt = new Date();
    this.settledAt = null;
    this.order = order;
    this.status = 'created';
    this.gateway = gateway;
    order.attachePayment(this);
  }

  get isNotRefunded(): boolean {
    return this.total > this.totalRefund;
  }

  get orderId(): string {
    return this.order.id;
  }

  get total(): number {
    return this.order.amount - this.feeGateway;
  }

  get totalRefund(): number {
    return this.refundCollection.reduce((entity, acc) => acc + entity.total, 0);
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

  // ACTION

  attacheRefund(refund: Refund): Payment {
    this.refundCollection.add(refund);

    return this;
  }

  capture(): void {
    this.feeGateway = Math.floor((Model.feeGatewayPercent / 100) * this.amount);
    this.status = 'captured';
  }
}
