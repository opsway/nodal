import { Merchant } from './merchant';

describe('Merchant', () => {
  it('should create an instance', () => {
    const entity = new Merchant(
      'foo'
    );
    expect(entity).toBeTruthy();
  });
});
