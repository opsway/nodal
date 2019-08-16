import * as Util from '../../util/util';
import {OrderItem} from '../order-item/order-item';
import {Item} from '../item/item';
import {Seller} from '../member/seller/seller';
import {Customer} from '../member/customer/customer';
import {Payment} from '../payment/payment';

export class Order {
  static STATUS_CREATED = 'created';
  static STATUS_SAVED = 'saved';
  static STATUS_PAID = 'paid';

  id: string;
  createdAt: Date;
  payment: Payment;
  status: string;
  customer: Customer;
  private collection: Map<string, OrderItem>;

  constructor(customer: Customer = null) {
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

  save(): boolean {
    if (this.isUnchanged) {
      return false;
    }
    this.status = Order.STATUS_SAVED;

    return true;
  }

  addItem(entity: OrderItem): OrderItem {
    this.collection.set(entity.id, entity);

    return entity;
  }
}
