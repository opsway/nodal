import * as Util from '../../util/util';
import { Entity } from './entity';
import {
  Serialize,
  SerializeProperty,
  Serializable,
} from '@delete21/ts-serializer';

@Serialize({})
export class Item extends Serializable implements Entity {
  @SerializeProperty({})
  id: string;

  constructor() {
    super();
    this.id = Util.uuid('SKU');
  }

  get name(): string {
    return this.id;
  }
}
