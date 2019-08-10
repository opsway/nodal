import * as Util from './util';

export class Transfer {
  id: string;
  amount: number;
  to: string;

  constructor(amount: number, to: string) {
    this.id = Util.uuid('T');
    this.amount = amount;
    this.to = to;
  }
}
