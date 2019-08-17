import * as Util from '../../util/util';
import {Item} from '../entity/item';
import {Seller} from '../member/seller/seller';
import {Order} from '../order/order';
import {Model} from '../model';
import {Entity} from '../entity/entity';
import {Payment} from '../payment/payment';
import {Collection} from '../collection';

export class OrderItem implements Entity {
  static STATUS_CREATED = 'created';
  static STATUS_SAVED = 'saved';
  static STATUS_CANCELED = 'canceled';
  static STATUS_PAID = 'paid';
  id: string;
  item: Item;
  qty: number;
  price: number;
  priceShipping: number;
  seller: Seller;
  refunded: boolean;
  order: Order;
  status: string;
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
    this.refunded = false;
    this.status = OrderItem.STATUS_CREATED;
  }

  get isSaved(): boolean {
    return this.status === OrderItem.STATUS_SAVED;
  }

  get isPaid(): boolean {
    return this.status === OrderItem.STATUS_PAID;
  }

  get isNew(): boolean {
    return this.status === OrderItem.STATUS_CREATED;
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

  save(): OrderItem {
    this.status = OrderItem.STATUS_SAVED;

    return this;
  }

  attachePayment(payment: Payment): OrderItem {
    this.payments.add(payment);
    this.status = OrderItem.STATUS_PAID;

    return this;
  }

  refund(): number {
    let refund = 0;
    if (!this.refunded && this.order.payment && this.order.payment.captured) {
      this.seller.balance -= refund = this.amountSeller;
    }
    this.refunded = true;
    return refund;
  }
}
