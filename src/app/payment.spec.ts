import {Order} from './order';
import {Payment} from './payment';
import {OrderItem} from './order-item';
import {Item} from './item';
import {Merchant} from './merchant';

describe('Payment', () => {
  it('should create an instance', () => {
    const entity = new Payment(
      new Order([
        new OrderItem(
          new Item(
            100,
          ),
          new Merchant('bar'),
        ),
      ]),
    );
    expect(entity).toBeTruthy();
/*    expect(entity.amount).toEqual(10000);
    expect(entity.feeMarket).toEqual(700);
    expect(entity.status).toEqual('created');
    entity.capture();
    expect(entity.status).toEqual('captured');
    expect(entity.feeGateway).toEqual(300);*/
  });
});
