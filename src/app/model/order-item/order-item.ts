import * as Util from '../../util/util';
import {Item} from '../entity/item';
import {Seller} from '../member/seller/seller';
import {Order} from '../order/order';
import {Model} from '../model';
import {Entity} from '../entity/entity';
import {Payment} from '../payment/payment';
import {Collection} from '../collection';
import {Invoice} from '../entity/invoice';

export class OrderItem implements Entity {
  static STATUS_ORDERED = 'ordered';
  static STATUS_PAID = 'paid';
  static STATUS_INVOICED = 'invoiced';
  static STATUS_RETURNED = 'returned';
  static STATUS_REFUNDED = 'refunded';
  static STATUS_CANCELED = 'canceled';
  static STATUS_SHIPPED = 'shipped';

  id: string;
  item: Item;
  qty: number;
  price: number;
  priceShipping: number;
  seller: Seller;
  isRefunded: boolean;
  isReturned: boolean;
  isCanceled: boolean;
  order: Order;
  status: string;
  private invoice: Invoice = null;
  private payments: Collection<Payment> = new Collection<Payment>();

  constructor(
    price: number, item: Item, // SellerItem
    priceShipping: number,
    qty: number,
    seller: Seller,
    order: Order = null,
  ) {
    this.id = Util.uuid('OI');
    this.item = item;
    this.seller = seller;
    this.order = order;
    this.qty = qty;
    this.price = price * Model.precisionOfPersist;
    this.priceShipping = priceShipping * Model.precisionOfPersist;
    this.isRefunded = false;
    this.isReturned = false;
    this.isCanceled = false;
    this.status = null;
  }

  get isInvoiced(): boolean {
    return this.invoice !== null;
  }

  get canInvoiced(): boolean {
    return !this.isCanceled
      && this.isPaid
      && !this.isInvoiced;
  }

  get canReturned(): boolean {
    return this.isPaid
      && this.isInvoiced
      && this.invoice.isShipped
      && !this.isReturned;
  }

  get canRefunded(): boolean {
   return this.isPaid
     && (
       this.isReturned
       || this.isCanceled
     )
     && !this.isRefunded;
  }

  get canCanceled(): boolean {
    return this.isPaid
      && !this.isInvoiced
      && !this.isCanceled;
  }

  get isShipped(): boolean {
    return this.invoice && this.invoice.isShipped;
  }

  get isPaid(): boolean {
    return this.payments.count() > 0;
  }

  get isNew(): boolean {
    return this.status === null;
  }

  get amount(): number {
    return this.price * this.qty;
  }

  get amountShipping(): number {
    return this.priceShipping * this.qty;
  }

  get feeMarket(): number {
    return Math.floor((Model.feeMarketPercent / 100) * this.amount) * (Model.feeMarketGST / 100 + 1);
  }

  get amountSeller(): number {
    return this.amount - this.feeMarket;
  }

  get sku(): string {
    return this.item.id;
  }

  get sellerName(): string {
    return this.seller.name;
  }

  get total(): number {
    return this.amount + this.amountShipping;
  }

  // ACTION

  return(): OrderItem {
    this.status = OrderItem.STATUS_RETURNED;
    this.isReturned = true;

    return this;
  }

  ship(): OrderItem {
    this.status = OrderItem.STATUS_SHIPPED;

    return this;
  }

  cancel(): OrderItem {
    this.status = OrderItem.STATUS_CANCELED;
    this.isCanceled = true;

    return this;
  }

  save(): OrderItem {
    this.status = OrderItem.STATUS_ORDERED;

    return this;
  }

  attacheInvoice(invoice: Invoice): OrderItem {
    this.invoice = invoice;
    this.status = OrderItem.STATUS_INVOICED;

    return this;
  }

  attachePayment(payment: Payment): OrderItem {
    this.payments.add(payment);
    this.status = OrderItem.STATUS_PAID;

    return this;
  }

  refund(): OrderItem {
    this.status = OrderItem.STATUS_REFUNDED;
    this.isRefunded = true;

    return this;
  }
}
