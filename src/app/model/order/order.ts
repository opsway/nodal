import * as Util from '../../util/util';
import {OrderItem} from '../order-item/order-item';
import {Customer} from '../member/customer/customer';
import {Payment} from '../payment/payment';
import {Collection} from '../collection';

export class Order {
  id: string;
  createdAt: Date;
  payment: Payment;
  customer: Customer;
  private collection: Collection<OrderItem>;

  constructor(customer: Customer = null) {
    this.id = Util.uuid('O');
    this.createdAt = new Date();
    this.customer = customer;
    this.collection = new Collection<OrderItem>();
  }

  // PROPERTIES

  get customerName(): string {
    return this.customer.name;
  }

  get items(): OrderItem[] {
    return this.collection.all();
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

  get noPaymentItems(): Collection<OrderItem> {
    return this.collection.filter(entity => !entity.isPaid);
  }

  get newItems(): Collection<OrderItem> {
    return this.collection.filter(entity => entity.isNew);
  }

  // STATUS
  get isNoPaid(): boolean {
    return this.noPaymentItems.count() > 0;
  }

  get isSaved(): boolean {
    return !this.isNew;
  }

  get isEmpty(): boolean {
    return this.collection.count() === 0;
  }

  get isNew(): boolean {
    return this.isEmpty
      || this.newItems.count() > 0;
  }

  get isUnchanged(): boolean {
    return this.amount <= 0;
  }

  // ACTION

  attachePayment(payment: Payment): Order {
    this.noPaymentItems
      .walk(entity => entity.attachePayment(payment));

    return this;
  }

  save(): Order {
    if (this.isUnchanged) {
      return this;
    }
    this.newItems
      .walk(entity => entity.save());

    return this;
  }

  addItem(entity: OrderItem): OrderItem {
    this.collection.add(entity);

    return entity;
  }
}
