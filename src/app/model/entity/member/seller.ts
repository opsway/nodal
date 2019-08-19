import * as Util from '../../../util/util';

export class Seller {
  id: string;
  name: string;
  balance = 0;

  constructor(name: string) {
    this.id = Util.uuid('M');
    this.name = name;
  }
}
