import * as Util from '../../util/util';
import { Entity } from './entity';
import { Collection } from '../collection';
import { Invoice } from './invoice';

export class SellerSettlement implements Entity {
  id: string;
  amount = 0;

  constructor(
    public sellerName: string,
    public createdAt: Date = new Date(),
    private invoiceCollection: Collection<Invoice> = new Collection<Invoice>(),
  ) {
    this.id = Util.uuid('ST_SL_');
  }

  get total(): number {
    return this.amount;
  }

  get references(): string {
    return this.invoiceCollection.map(entity => entity.id).join(', ');
  }

  capture(invoice: Invoice): this {
    this.amount += invoice.amountSeller;
    this.invoiceCollection.add(invoice);

    return this;
  }
}
