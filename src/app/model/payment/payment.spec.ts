import {Order} from '../order/order';
import {Payment} from './payment';
import {Customer} from '../member/customer';
import * as Util from '../../util/util';
import {TestBed} from '@angular/core/testing';
import {Item} from '../item/item';
import {Merchant} from '../member/merchant';

describe('Payment', () => {
  beforeEach(() => {
    Util.sequenceClear();
  });

  it('should create an instance', () => {
    const order = new Order(new Customer('bob', 100));
    order.add(
      new Item(
        100,
      ),
      new Merchant('bar'),
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
