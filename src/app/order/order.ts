import * as Util from '../util';
import {OrderItem} from './order-item';
import {Item} from '../catalog/item';
import {Merchant} from '../member/merchant';
import {Customer} from '../member/customer';

export class Order {
  static STATUS_CREATED = 'created';
  static STATUS_ORDERED = 'ordered';
  static STATUS_PAID = 'paid';

  id: string;
  status: string;
  customer: Customer;
  private collection: Map<string, OrderItem>;

  constructor(customer: Customer) {
    this.id = Util.uuid('O');
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
    return this.amount + this.amountShipping;
  }

  get feeMarket(): number {
    return this.items.reduce((amount, item) => amount + item.feeMarket, 0);
  }

  checkout(): void {
    this.status = Order.STATUS_ORDERED;
  }

  add(item: Item, merchant: Merchant): void {
    const id = OrderItem.genId(item, merchant);
    if (this.collection.has(id)) {
      this.collection.get(id).qty++;
    } else {
      this.collection.set(id, new OrderItem(item, merchant, this));
    }
  }
}
