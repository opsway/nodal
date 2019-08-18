import { Refund } from './refund';
import payment from './payment.stub';

describe('Refund', () => {
  it('should create an instance', () => {
    expect(new Refund(payment())).toBeTruthy();
  });
});
