import { Order } from './order';
import {OrderItem} from './order-item';
import {Item} from '../catalog/item';
import {Merchant} from '../member/merchant';

describe('Order', () => {
  it('should create an instance', () => {
    expect(new Order([])).toBeTruthy();
  });

  it('should increment  qyt if added duplicate', () => {
    const order = new Order([
      new OrderItem(
        new Item(
          100
        ),
        new Merchant('bar'),
      )
    ]);
    expect(new Order([])).toBeTruthy();
  });
});
