import { Order } from './order';
import {Customer} from '../member/customer';

describe('Order', () => {
  it('should create an instance', () => {
    expect(new Order(new Customer('bob', 100))).toBeTruthy();
  });

  it('should increment  qyt if added duplicate', () => {
    expect(new Order(new Customer('bob', 100))).toBeTruthy();
  });
});
