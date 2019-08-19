import * as Util from '../../util/util';
import { Entity } from './entity';
import { Seller } from './member/seller';
import { Collection } from '../collection';
import { OrderItem } from './order/order-item';
import { Order } from './order/order';

export class Invoice implements Entity {
  static STATUS_CANCELED = 'canceled';
  static STATUS_SHIPPED = 'shipped';
  static STATUS_CAPTURED = 'captured';
  static STATUS_CREATED = 'created';

  id: string;
  createdAt: Date;
  settledAt: Date;
  settledMarketAt: Date;
  status: string;

  constructor(
    public seller: Seller,
    public items: Collection<OrderItem> = new Collection<OrderItem>(),
  ) {
    this.id = Util.uuid('INV');
    this.settledAt = null;
    this.settledMarketAt = null;
    this.status = Invoice.STATUS_CREATED;
    this.createdAt = null;
  }

  get isDraft(): boolean {
    return this.createdAt === null;
  }

  get canCanceled(): boolean {
    return !this.isDraft
      && !this.isShipped
      && !this.isCanceled;
  }

  get canShipped(): boolean {
    return !this.isDraft
      && !this.isCanceled
      && !this.isShipped;
  }

  get isShipped(): boolean {
    return this.status === Invoice.STATUS_SHIPPED;
  }

  get isCanceled(): boolean {
    return this.status === Invoice.STATUS_CANCELED;
  }

  get isSaved(): boolean {
    return this.createdAt === null;
  }

  get totalFeeMarket(): number {
    return this.items.reduce((entity, acc) => acc + entity.feeMarket, 0);
  }

  get amountShipping(): number {
    return this.items.reduce((entity, acc) => acc + entity.amountShipping, 0);
  }

  get amountSeller(): number {
    return this.items.reduce((entity, acc) => acc + entity.amountSeller, 0);
  }

  hasOrder(o: Order): boolean {
    return this.items
      .filter(e => e.orderId === o.id)
      .count() > 0;
  }

  save(): Invoice {
    this.createdAt = new Date();
    return this;
  }

  ship(): Invoice {
    this.status = Invoice.STATUS_SHIPPED;
    this.items.walk(entity => entity.ship());

    return this;
  }

  cancel(): Invoice {
    this.status = Invoice.STATUS_CANCELED;
    this.items.walk(entity => entity.cancel());

    return this;
  }

  get isCaptured(): boolean {
    return this.status === Invoice.STATUS_CAPTURED;
  }

  get isMarketCaptured(): boolean {
    return this.settledMarketAt !== null;
  }
}
