import * as Util from '../../../util/util';
import { Entity } from '../entity';
import { Collection } from '../../collection';
import { Invoice } from '../invoice';

export class SellerSettlement implements Entity {
  id: string;
  amount = 0;
  references: string[] = [];

  constructor(
    public sellerName: string,
    public createdAt: Date = new Date(),
  ) {
    this.id = Util.uuid('ST_SL_');
  }

  get total(): number {
    return this.amount;
  }

  capture(invoice: Invoice): this {
    this.amount += invoice.amountSeller;
    this.references.push(invoice.id);

    return this;
  }
}
