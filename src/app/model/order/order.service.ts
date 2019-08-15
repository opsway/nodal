import {Injectable} from '@angular/core';
import {Order} from './order';
import {Customer} from '../member/customer/customer';
import {Seller} from '../member/seller/seller';
import {Item} from '../item/item';
import {OrderItem} from '../order-item/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private collection: Map<string, Order>;

  constructor() {
    this.collection = new Map();
  }

  find(id: string): Order | null {
    return this.collection.get(id) || null;
  }

  create(customer: Customer): Order {
    const order = new Order(customer);
    this.collection.set(order.id, order);

    return order;
  }

  currentCart(customer: Customer): Order {
    const match = this.filter((order: Order) => order.customer.id === customer.id && order.isNew);
    if (match.length > 0) {
      return match[0];
    }

    return this.create(customer);
  }

  checkout(customer: Customer): void {
    const cart = this.currentCart(customer);
    if (cart.amount > 0) {
      cart.checkout();
      this.create(customer);
    }
  }

  addToCart(
    customer: Customer,
    seller: Seller,
    item: Item,
  ): void {
    console.log(customer, seller, item);
    this.currentCart(customer).add(item, seller);
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
    return Array.from(this.collection.values()).filter((it: Order) => it.status !== Order.STATUS_CREATED);
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
