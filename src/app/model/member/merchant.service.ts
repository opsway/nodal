import { Injectable } from '@angular/core';
import {Merchant} from './merchant';
import {Customer} from './customer';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private collection: Map<string, Merchant>;

  constructor() {
    this.collection = new Map();
    [
      'TA',
      'SAAN',
      'RA',
      'CFC',
      'SWA',
    ].forEach((name: string) => {
      const entity = new Merchant(name);
      this.collection.set(entity.id, entity);
    });
  }

  find(id: string): Merchant|null {
    return this.collection.get(id) || null;
  }

  all(): Merchant[] {
    return Array.from(this.collection.values());
  }

  first(): Merchant|null {
    return this.all()[0] || null;
  }
}
