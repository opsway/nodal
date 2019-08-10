import * as Util from './util';
import {OrderItem} from './order-item';
import {Item} from './item';
import {Merchant} from './merchant';

export class Order {
  id: string;
  private collection: Map<string, OrderItem>;

  constructor(items: OrderItem[]) {
    this.id = Util.uuid('O');
    this.collection = new Map();
    items.forEach((item: OrderItem) => {
      this.collection.set(item.id, item);
    });
  }

  get items(): OrderItem[] {
    return Array.from(this.collection.values());
  }

  get amount(): number {
    return this.items.reduce((amount, item) => amount + item.amount, 0);
  }

  get feeMarket(): number {
    return this.items.reduce((amount, item) => amount + item.feeMarket, 0);
  }

  add(item: Item, merchant: Merchant): void {
    const id = OrderItem.genId(item, merchant);
    if (this.collection.has(id)) {
      this.collection.get(id).qty++;
    } else {
      this.collection.set(id, new OrderItem(item, merchant));
    }
  }
}
