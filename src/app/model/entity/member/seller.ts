import * as Util from '../../../util/util';
import {Serialize, SerializeProperty, Serializable} from '@delete21/ts-serializer';

@Serialize({})
export class Seller extends Serializable {
  @SerializeProperty({})
  id: string;
  @SerializeProperty({})
  name: string;
  balance = 0;

  constructor(name: string) {
    super();
    this.id = Util.uuid('M');
    this.name = name;
  }
}
