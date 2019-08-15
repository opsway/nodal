import {Order} from '../order/order';
import {Payment} from './payment';
import {Customer} from '../member/customer/customer';
import * as Util from '../../util/util';
import {Item} from '../item/item';
import {Seller} from '../member/seller/seller';

describe('Payment', () => {
  beforeEach(() => {
    Util.sequenceClear();
  });

  it('should create an instance', () => {
    const order = new Order(new Customer('bob'));
    order.addItem(
      new Item(
        100,
      ),
      new Seller('bar'),
    );
    const entity = new Payment(
      order,
      'foo',
    );
    expect(entity).toBeTruthy();
    expect(entity.amount).toEqual(10000);
    expect(entity.feeMarket).toEqual(826);
    expect(entity.status).toEqual('created');
    entity.capture();
    expect(entity.status).toEqual('captured');
    expect(entity.feeGateway).toEqual(210);
  });
});
