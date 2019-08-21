import * as Util from '../../../util/util';
import { Entity } from '../entity';
import { Collection } from '../../collection';
import { Invoice } from '../invoice';

export class MarketSettlement implements Entity {
  id: string;
  amount = 0;
  amountShipping = 0;
  totalFeeMarket = 0;

  constructor(
    public feeGW: number,
    public createdAt: Date = new Date(),
    private invoiceCollection: Collection<Invoice> = new Collection<Invoice>(),
  ) {
    this.id = Util.uuid('ST_M_');
    this.amount -= feeGW;
  }

  get total(): number {
    return this.amount;
  }

  get references(): string {
    return this.invoiceCollection.map(entity => entity.id).join(', ');
  }

  capture(invoice: Invoice): this {
    this.amountShipping += invoice.amountShipping;
    this.totalFeeMarket += invoice.totalFeeMarket;
    this.amount += invoice.amountShipping + invoice.totalFeeMarket;
    this.invoiceCollection.add(invoice);

    return this;
  }
}
