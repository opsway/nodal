import * as Util from '../../../util/util';
import {Serialize, SerializeProperty, Serializable} from '@delete21/ts-serializer';

@Serialize({})
export class Customer extends Serializable {
  @SerializeProperty({})
  id: string;
  @SerializeProperty({})
  name: string;
  balance: number;

  constructor(
    name: string,
  ) {
    super();
    this.id = Util.uuid('C');
    this.name = name;
    this.balance = 0;
  }
}
