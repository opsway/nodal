import * as Util from '../../util/util';
import {OrderItem} from './order-item';
import {Item} from '../item/item';
import {Merchant} from '../member/merchant';
import {Customer} from '../member/customer';
import {Payment} from '../payment/payment';

export class Order {
  static STATUS_CREATED = 'created';
  static STATUS_ORDERED = 'ordered';
  static STATUS_PAID = 'paid';

  id: string;
  createdAt: Date;
  payment: Payment;
  status: string;
  customer: Customer;
  private collection: Map<string, OrderItem>;

  constructor(customer: Customer) {
    this.id = Util.uuid('O');
    this.createdAt = new Date();
    this.status = Order.STATUS_CREATED;
    this.customer = customer;
    this.collection = new Map();
  }

  get isPaid(): boolean {
    return this.status === Order.STATUS_PAID;
  }

  get isNew(): boolean {
    return this.status === Order.STATUS_CREATED;
  }

  get isUnchanged(): boolean {
    return this.amount <= 0;
  }

  get items(): OrderItem[] {
    return Array.from(this.collection.values());
  }

  get amount(): number {
    return this.items.reduce((amount, item) => amount + item.amount, 0);
  }

  get amountShipping(): number {
    return this.items.reduce((amount, item) => amount + item.amountShipping, 0);
  }

  get total(): number {
    return this.items.reduce((amount, item) => amount + item.total, 0);
  }

  get feeMarket(): number {
    return this.items.reduce((amount, item) => amount + item.feeMarket, 0);
  }

  attachePayment(payment: Payment): void {
    this.status = Order.STATUS_PAID;
    this.payment = payment;
  }

  checkout(): void {
    this.status = Order.STATUS_ORDERED;
  }

  add(
    item: Item,
    merchant: Merchant,
    qty: number = 1,
  ): OrderItem {
    let entity : OrderItem;
    const id = OrderItem.genId(
      this,
      merchant,
      item,
    );

    if (this.collection.has(id)) {
      entity = this.collection.get(id);
    } else {
      entity = new OrderItem(item, merchant, this);
      this.collection.set(entity.id, entity);
    }

    entity.qty += qty;

    return entity;
  }
}
