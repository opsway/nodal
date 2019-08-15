import { Injectable } from '@angular/core';
import {Seller} from './seller';
import {Customer} from '../customer/customer';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private collection: Map<string, Seller>;

  constructor() {
    this.collection = new Map();
    [
      'TA',
      'SAAN',
      'RA',
      'CFC',
      'SWA',
    ].forEach((name: string) => {
      const entity = new Seller(name);
      this.collection.set(entity.id, entity);
    });
  }

  find(id: string): Seller|null {
    return this.collection.get(id) || null;
  }

  all(): Seller[] {
    return Array.from(this.collection.values());
  }

  first(): Seller|null {
    return this.all()[0] || null;
  }
}
