import * as Util from '../../../util/util';

export class Customer {
  id: string;
  name: string;
  balance: number;

  constructor(
    name: string,
  ) {
    this.id = Util.uuid('C');
    this.name = name;
    this.balance = 0;
  }
}
