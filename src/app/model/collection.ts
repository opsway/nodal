import { Entity } from './entity/entity';

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

  load(list: T[]): Collection<T> {
    list.forEach(entity => this.add(entity));

    return this;
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

  getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getRandom(): T {
    return this.all()[`${this.getRandomInt(this.all().length)}`];
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

  sort(compare: (a: T, b: T) => number): Collection<T> {
    return this.load(this.all().sort(compare));
  }

  map<U>(mapper: (entity: T) => U): U[] {
    const result = [];
    this.elements.forEach((entity: T) => {
      result.push(mapper(entity));
    });

    return result;
  }
}
