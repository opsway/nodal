import * as Util from '../util';


export class Item {
  id: string;
  price: number;

  constructor(price: number) {
    this.id = Util.uuid('SKU');
    this.price = price * 100;
  }

  get name(): string {
    return this.id;
  }
}
