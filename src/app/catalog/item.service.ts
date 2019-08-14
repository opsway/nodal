import {Injectable} from '@angular/core';
import {Item} from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private collection: Map<string, Item>;

  constructor() {
    this.collection = new Map();
    [
      200,
      300,
      350,
      150,
    ].forEach(price => {
      const item = new Item(price);
      this.collection.set(item.id, item);
    });
  }

  all(): Item[] {
    return Array.from(this.collection.values());
  }

  find(id: string): Item | undefined {
    return this.collection.get(id);
  }

  count(): number {
    return this.collection.size;
  }
}
