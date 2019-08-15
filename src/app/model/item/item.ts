import * as Util from '../../util/util';

export class Item {
  id: string;
  price: number;

  constructor() {
    this.id = Util.uuid('SKU');
  }

  get name(): string {
    return this.id;
  }
}
