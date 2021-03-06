import * as Util from '../../../util/util';
import { Item } from '../item';
import { Seller } from '../member/seller';
import { Model } from '../../model';
import { Entity } from '../entity';
import { Payment } from '../payment';
import { Invoice } from '../invoice';
import { Refund } from '../refund';
import {
  Serialize,
  SerializeProperty,
  Serializable,
} from '@delete21/ts-serializer';
import { OrderByDate } from '../order-by-date';

@Serialize({})
export class OrderItem extends Serializable implements Entity, OrderByDate {
  static STATUS_ORDERED = 'ordered';
  static STATUS_PAID = 'paid';
  static STATUS_INVOICED = 'invoiced';
  static STATUS_RETURNED = 'returned';
  static STATUS_REFUNDED = 'refunded';
  static STATUS_CANCELED = 'canceled';
  static STATUS_SHIPPED = 'shipped';
  @SerializeProperty({})
  id: string;
  @SerializeProperty({
    type: Item
  })
  item: Item;
  @SerializeProperty({})
  qty: number;
  @SerializeProperty({})
  price: number;
  @SerializeProperty({})
  priceShipping: number;
  @SerializeProperty({
    type: Seller
  })
  seller: Seller;
  isRefunded: boolean;
  isReturned: boolean;
  isCanceled: boolean;
  status: string;
  invoice: Invoice = null;
  createdAt: Date; // FIXME
  private payment: Payment;

  constructor(
    price: number, item: Item, // SellerItem
    priceShipping: number,
    qty: number,
    seller: Seller,
    public orderId: string,
  ) {
    super();
    this.id = Util.uuid('OI');
    this.item = item;
    this.seller = seller;
    this.qty = qty;
    this.price = price * Model.precisionOfPersist;
    this.priceShipping = priceShipping * Model.precisionOfPersist;
    this.isRefunded = false;
    this.isReturned = false;
    this.isCanceled = false;
    this.status = null;
    this.payment = null;
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
    return (
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

  get isPaid(): boolean {
    return this.payment !== null;
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
    return Math.floor((Model.marketFee / 100) * this.amount) * (Model.marketFeeGST / 100 + 1);
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
    return this.isRefunded ? 0 : this.amount + this.amountShipping;
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
    this.payment = payment;
    this.status = OrderItem.STATUS_PAID;

    return this;
  }

  refund(refund: Refund): OrderItem {
    refund.attacheOrderItem(this);
    this.status = OrderItem.STATUS_REFUNDED;
    this.isRefunded = true;

    return this;
  }
}
