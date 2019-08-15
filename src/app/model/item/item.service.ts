import {Injectable} from '@angular/core';
import {Item} from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private collection: Map<string, Item>;

  constructor() {
    this.collection = new Map();
    this.create();
    this.create();
    this.create();
    this.create();
  }

  create(): Item {
    const item = new Item();
    this.collection.set(item.id, item);

    return item;
  }

  all(): Item[] {
    return Array.from(this.collection.values());
  }

  find(id: string): Item | null {
    return this.collection.get(id) || null;
  }

  count(): number {
    return this.collection.size;
  }

  first(): Item {
    return this.all()[0] || this.create();
  }
}
