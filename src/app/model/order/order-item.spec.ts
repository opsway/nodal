import {Item} from '../item/item';
import {Merchant} from '../member/merchant';
import {OrderItem} from './order-item';
import {Order} from './order';
import {Customer} from '../member/customer';
import * as Util from '../../util/util';

describe('OrderItem', () => {
  beforeEach(() => {
    Util.sequenceClear();
  });

  it('should create an instance', () => {
    const order = new Order(new Customer('bob', 100));

    const entity = order.add(
      new Item(100),
      new Merchant('bar'),
    );
    expect(entity).toBeTruthy();
    expect(entity.amount).toEqual(10000);
    expect(entity.feeMarket).toEqual(826);
    expect(entity.amountMerchant).toEqual(9174);
    expect(entity.id).toEqual('O1-M1-SKU1');
  });
});
