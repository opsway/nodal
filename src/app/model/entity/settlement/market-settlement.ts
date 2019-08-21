import * as Util from '../../../util/util';
import { Entity } from '../entity';
import { Collection } from '../../collection';
import { Invoice } from '../invoice';

export class MarketSettlement implements Entity {
  id: string;
  amountShipping = 0;
  totalFeeMarket = 0;
  references: string[] = [];

  constructor(
    public createdAt: Date = new Date(),
  ) {
    this.id = Util.uuid('ST_M');
  }

  get total(): number {
    return this.amountShipping + this.totalFeeMarket;
  }

  capture(invoice: Invoice): this {
    this.amountShipping += invoice.amountShipping;
    this.totalFeeMarket += invoice.totalFeeMarket;
    this.references.push(invoice.id);

    return this;
  }
}
