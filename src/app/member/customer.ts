import * as Util from '../util';

export class Customer {
  id: string;
  name: string;
  shippingPrice: number;
  balance: number;

  constructor(
    name: string,
    shippingPrice: number,
  ) {
    this.id = Util.uuid('C');
    this.name = name;
    this.shippingPrice = shippingPrice * 100;
    this.balance = 0;
  }
}
