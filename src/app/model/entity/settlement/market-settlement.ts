import * as Util from '../../../util/util';
import { Entity } from '../entity';
import { Invoice } from '../invoice';

export class MarketSettlement implements Entity {
  id: string;
  amountShipping = 0;
  totalFeeMarket = 0;
  references: string[] = [];

  constructor(
    public feeGW: number,
    public createdAt: Date,
  ) {
    this.id = Util.uuid('ST_M');
  }

  get total(): number {
    return this.amountShipping + this.totalFeeMarket - this.feeGW;
  }

  capture(invoice: Invoice): this {
    this.amountShipping += invoice.amountShipping;
    this.totalFeeMarket += invoice.totalFeeMarket;
    this.references.push(invoice.id);
    invoice.captureMarket(this.createdAt);

    return this;
  }
}
