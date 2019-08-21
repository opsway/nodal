import * as Util from '../../../util/util';
import { Entity } from '../entity';
import { Payment } from '../payment';
import { Collection } from '../../collection';
import { Refund } from '../refund';
import { Model } from '../../model';

export class GatewaySettlement implements Entity {
  id: string;
  fee = 0;
  totalPayment = 0;
  countPayment = 0;
  totalRefund = 0;
  countRefund = 0;
  references: string[] = [];

  constructor(
    public gateway: string,
    public createdAt: Date = new Date(),
  ) {
    this.id = Util.uuid('ST_GW');
  }

  get amount(): number {
    return this.totalPayment - this.totalRefund;
  }

  get total(): number {
    return this.amount - this.fee;
  }

  private static calcFee(amoint: number): number {
    return Math.floor((Model.paymentGatewayFee / 100) * amoint);
  }

  withPayment(payments: Collection<Payment>): this {
    payments.walk(entity => {
      entity.capture(GatewaySettlement.calcFee(entity.amount), this.createdAt);
      this.countPayment++;
      this.totalPayment += entity.amount;
      this.references.push(entity.id);
      this.fee += entity.feeGateway;
    });

    return this;
  }

  withRefund(refunds: Collection<Refund>): this {
    refunds.walk(entity => {
      this.countRefund++;
      this.totalRefund += entity.total;
      this.references.push(entity.id);
      entity.capture(this.createdAt);
    });

    return this;
  }
}
