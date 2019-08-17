import * as Util from '../../util/util';
import {Entity} from './entity';

export class Item implements Entity {
  id: string;

  constructor() {
    this.id = Util.uuid('SKU');
  }

  get name(): string {
    return this.id;
  }
}
