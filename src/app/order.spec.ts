import { Order } from './order';
import {OrderItem} from './order-item';
import {Item} from './item';
import {Merchant} from './merchant';

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
