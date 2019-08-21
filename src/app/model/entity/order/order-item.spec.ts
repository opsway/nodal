import { Item } from '../item';
import { Seller } from '../member/seller';
import { OrderItem } from './order-item';
import * as Util from '../../../util/util';

describe('OrderItem', () => {
  beforeEach(() => {
    Util.sequenceClear();
  });

  it('should create an instance', () => {
    const entity = new OrderItem(
      100,
      new Item(),
      50,
      1,
      new Seller('bar'),
      'O1'
    );
    expect(entity).toBeTruthy();
    expect(entity.amount).toEqual(10000);
    expect(entity.feeMarket).toEqual(826);
    expect(entity.amountSeller).toEqual(9174);
    expect(entity.sku).toEqual('SKU_1');
    expect(entity.sellerName).toEqual('bar');
    expect(entity.id).toEqual('OI_1');
  });
});
