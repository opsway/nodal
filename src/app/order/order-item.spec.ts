import {Item} from '../catalog/item';
import {Merchant} from '../member/merchant';
import {OrderItem} from './order-item';
import {Order} from './order';
import {Customer} from '../member/customer';

describe('OrderItem', () => {
  it('should create an instance', () => {
    const order = new Order(new Customer('bob', 100));
    const entity = new OrderItem(
      new Item(100),
      new Merchant('bar'),
      order,
    );
    expect(entity).toBeTruthy();
    expect(entity.amount).toEqual(10000);
    expect(entity.feeMarket).toEqual(826);
    expect(entity.amountMerchant).toEqual(9174);
  });
});
