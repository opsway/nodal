import {Injectable} from '@angular/core';
import {OrderItem} from './order-item';
import {Item} from '../item/item';
import {Seller} from '../member/seller/seller';
import {Order} from '../order/order';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private collection: Map<string, OrderItem>;

  constructor() {
    this.collection = new Map();
  }

  create(
    price: number,
    item: Item,
    shippingPrice: number,
    qty: number,
    seller: Seller,
    order: Order = null,
  ): OrderItem {
    const entity = new OrderItem(
      price,
      item,
      shippingPrice,
      qty,
      seller,
      order,
    );
    this.collection.set(entity.id, entity);

    return entity;
  }

  findByOrder(order: Order): OrderItem[] {
    return this.all().filter((it: OrderItem) => it.order.id === order.id);
  }

  all(): OrderItem[] {
    return Array.from(this.collection.values()).reverse();
  }
}
