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
  settledSellerAt: Date;
  status: string;

  constructor(
    public seller: Seller,
    public items: Collection<OrderItem> = new Collection<OrderItem>(),
  ) {
    this.id = Util.uuid('INV');
    this.settledAt = null;
    this.settledMarketAt = null;
    this.settledSellerAt = null;
    this.status = Invoice.STATUS_CREATED;
    this.createdAt = null;
  }

  get isDraft(): boolean {
    return this.createdAt === null;
  }

  get canMarketCaptured(): boolean {
    return !this.isCanceled
      && !this.isMarketCaptured;
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

  get totalFeeMarket(): number {
    return this.items.reduce((entity, acc) => acc + entity.feeMarket, 0);
  }

  get amountShipping(): number {
    return this.items.reduce((entity, acc) => acc + entity.amountShipping, 0);
  }

  get amountSeller(): number {
    return this.items.reduce((entity, acc) => acc + entity.amountSeller, 0);
  }

  get total(): number {
    return this.amountShipping + this.totalFeeMarket + this.amountSeller;
  }

  hasOrder(o: Order): boolean {
    return this.items
      .filter(e => e.orderId === o.id)
      .count() > 0;
  }

  save(date: Date = new Date()): Invoice {
    this.createdAt = date;
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

  captureSeller(date: Date): this {
    this.settledSellerAt = date;
    if (this.isMarketCaptured) {
      this.status = Invoice.STATUS_CAPTURED;
    }

    return this;
  }

  captureMarket(date: Date): this {
    this.settledMarketAt = date;
    if (this.isSellerCaptured) {
      this.status = Invoice.STATUS_CAPTURED;
    }

    return this;
  }

  get isSellerCaptured(): boolean {
    return this.settledSellerAt !== null;
  }

  get isMarketCaptured(): boolean {
    return this.settledMarketAt !== null;
  }
}
