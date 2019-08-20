import * as Util from '../../util/util';
import { Entity } from './entity';
import { Model } from '../model';
import { Payment } from './payment';
import { Collection } from '../collection';

export class Settlement implements Entity {
  id: string;
  fee = 0;
  total = 0;
  references: string[] = [];
  totalPayment = 0;
  countPayment = 0;
  totalRefund = 0;
  countRefund = 0;

  constructor(
    public gateway: string,
    public createdAt: Date = new Date(),
    private paymentCollection: Collection<Payment> = new Collection<Payment>(),
  ) {
    this.id = Util.uuid('ST_GW_');
  }

  get amount(): number {
    return this.total + this.fee;
  }

  capture(payment: Payment): Settlement {
    const feeGateway = Math.floor((Model.paymentGatewayFee / 100) * payment.totalSettlement);
    this.total += payment.totalSettlement - feeGateway;
    this.fee += feeGateway;
    payment.capture(feeGateway, this.createdAt);
    this.paymentCollection.add(payment);
    this.references = this.paymentCollection.map(entity => entity.id);
    this.totalPayment = this.paymentCollection.reduce((entity, acc) => acc + entity.total, 0);
    this.countPayment = this.paymentCollection.count();
    this.totalRefund = this.paymentCollection.reduce((entity, acc) => acc + entity.totalRefund, 0);
    this.countRefund = this.paymentCollection.reduce((entity, acc) => acc + entity.countRefund, 0);

    return this;
  }
}
