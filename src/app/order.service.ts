import { Injectable } from '@angular/core';
import {Order} from './order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private collection;

  constructor() {
    this.collection = new Map();
  }

  find(id: string): Order | null {
    return this.collection.get(id);
  }

  all(): Array<Order> {
    return Array.from(this.collection.values());
  }
}
