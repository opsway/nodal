import { Customer } from './customer';

describe('Customer', () => {
  it('should create an instance', () => {
    expect(new Customer('bob', 100)).toBeTruthy();
  });
});
