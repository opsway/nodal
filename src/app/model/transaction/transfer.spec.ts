import { Transfer } from './transfer';

describe('Transfer', () => {
  it('should create an instance', () => {
    expect(new Transfer(1000, 'alice')).toBeTruthy();
  });
});
