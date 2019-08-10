import { Item } from './item';
import { Merchant } from './merchant';
import { OrderItem } from './order-item';

describe('OrderItem', () => {
  it('should create an instance', () => {
    const entity = new OrderItem(new Item(100), new Merchant('bar'));
    expect(entity).toBeTruthy();
    expect(entity.amount).toEqual(10000);
    expect(entity.feeMarket).toEqual(700);
    expect(entity.amountMerchant).toEqual(9300);
  });
});
