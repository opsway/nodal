import * as Util from '../../util/util';
import { Entity } from './entity';
import { Model } from '../model';
import { Payment } from './payment';
import { Collection } from '../collection';

export class Settlement implements Entity {
  id: string;
  fee = 0;
  amount = 0;

  constructor(
    public gateway: string,
    public createdAt: Date = new Date(),
    private paymentCollection: Collection<Payment> = new Collection<Payment>(),
  ) {
    this.id = Util.uuid('ST_GW_');
  }

  get total(): number {
    return  this.amount + this.fee;
  }

  get references(): string {
    return this.paymentCollection.map(entity => entity.id).join(', ');
  }

  get totalPayment(): number {
    return this.paymentCollection.reduce((entity, acc) => acc + entity.total, 0);
  }

  get countPayment(): number {
    return this.paymentCollection.count();
  }

  get totalRefund(): number {
    return this.paymentCollection.reduce((entity, acc) => acc + entity.totalRefund, 0);
  }

  get countRefund(): number {
    return this.paymentCollection.reduce((entity, acc) => acc + entity.countRefund, 0);
  }

  capture(payment: Payment): Settlement {
    const feeGateway = Math.floor((Model.paymentGatewayFee / 100) * payment.totalSettlement);
    this.amount += payment.totalSettlement - feeGateway;
    this.fee += feeGateway;
    payment.capture(feeGateway, this.createdAt);
    this.paymentCollection.add(payment);
    return this;
  }
}
