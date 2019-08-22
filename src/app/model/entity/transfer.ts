import * as Util from '../../util/util';
import { Entity } from './entity';
import { OrderByDate } from './order-by-date';

export class Transfer implements Entity, OrderByDate {
  id: string;

  constructor(
    public holder: string,
    public ref: string,
    public amount: number,
    public balance: number,
    public createdAt = new Date(),
  ) {
    this.id = Util.uuid('T');
  }
}
