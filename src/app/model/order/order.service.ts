import {Injectable} from '@angular/core';
import {Order} from './order';
import {Customer} from '../member/customer/customer';
import {OrderItem} from '../order-item/order-item';
import {OrderItemService} from '../order-item/order-item.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private collection: Map<string, Order>;

  constructor(
    private orderItemService: OrderItemService,
  ) {
    this.collection = new Map();
  }

  find(id: string): Order | null {
    return this.collection.get(id) || null;
  }

  create(customer: Customer = null): Order {
    const order = new Order(customer);
    this.collection.set(order.id, order);

    return order;
  }

  currentOrder(): Order {
    const match = this.filter((order: Order) => order.isNew);
    if (match.length > 0) {
      return match[0];
    }

    return this.create();
  }

  filter(fn: (value: Order) => boolean): Order[] {
    const result = [];
    this.collection.forEach((entity: Order) => {
      if (fn(entity)) {
        result.push(entity);
      }
    });

    return result;
  }

  all(): Order[] {
    return Array.from(this.collection.values()).filter((it: Order) => it.isSaved);
  }

  get total(): number {
    return this.all().reduce((acc, it: Order) => acc + it.total, 0);
  }

  get feeMarket(): number {
    return this.all().reduce((acc, it: Order) => acc + it.feeMarket, 0);
  }

  get amountShipping(): number {
    return this.all().reduce((acc, it: Order) => acc + it.amountShipping, 0);
  }

  get amount(): number {
    return this.all().reduce((acc, it: Order) => acc + it.amount, 0);
  }

  get items(): OrderItem[] {
    const result: OrderItem[] = [];
    this.all().forEach((it: Order) => {
       result.push(...it.items);
     });

    return result;
  }
}
