import { Injectable } from '@angular/core';
import {Customer} from './customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private collection: Map<string, Customer>;

  constructor() {
    this.collection = new Map();
    [
      'A',
      'B',
      'C',
      'D',
      'F',
      'F',
      'G',
    ].forEach((name: string) => {
      const entity = new Customer(name);
      this.collection.set(entity.id, entity);
    });
  }

  find(id: string): Customer|null {
    return this.collection.get(id) || null;
  }

  all(): Customer[] {
    return Array.from(this.collection.values());
  }

  first(): Customer {
    return this.all()[0] || null;
  }
}
