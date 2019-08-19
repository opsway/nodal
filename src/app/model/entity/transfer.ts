import * as Util from '../../util/util';
import { Entity } from './entity';

export class Transfer implements Entity {
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
