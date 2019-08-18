import {Entity} from './entity/entity';

export class Collection<T extends Entity> {
  constructor(
    private elements: Map<string, T> = new Map(),
  ) {
  }

  all(): T[] {
    return Array.from(this.elements.values());
  }

  find(id: string): T | null {
    return this.elements.get(id) || null;
  }

  load(list: T[]): void {
    list.forEach(entity => this.add(entity));
  }

  add(entity: T): T {
    this.elements.set(entity.id, entity);

    return entity;
  }

  count(): number {
    return this.elements.size;
  }

  first(): T | null {
    return this.all()[0] || null;
  }

  filter(predicate: (entity: T) => boolean): Collection<T> {
    const result = new Collection<T>();
    this.elements.forEach((entity: T) => {
      if (predicate(entity)) {
        result.add(entity);
      }
    });

    return result;
  }

  walk(walker: (entity: T) => void): void {
    this.elements.forEach((entity: T) => walker(entity));
  }

  reduce<U>(reducer: (entity: T, acc: U) => U, initial: U): U {
    let result = initial;
    this.elements.forEach((entity: T) => {
      result = reducer(entity, result);
    });

    return result;
  }
}
