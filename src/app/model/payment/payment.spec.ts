import {Order} from '../order/order';
import {Payment} from './payment';
import {Customer} from '../member/customer';

describe('Payment', () => {
  it('should create an instance', () => {
    const entity = new Payment(new Order(new Customer('bob', 100)));
    expect(entity).toBeTruthy();
/*    expect(entity.amount).toEqual(10000);
    expect(entity.feeMarket).toEqual(700);
    expect(entity.status).toEqual('created');
    entity.capture();
    expect(entity.status).toEqual('captured');
    expect(entity.feeGateway).toEqual(300);*/
  });
});
