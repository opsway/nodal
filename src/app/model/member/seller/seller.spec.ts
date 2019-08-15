import { Seller } from './seller';

describe('Seller', () => {
  it('should create an instance', () => {
    const entity = new Seller(
      'foo'
    );
    expect(entity).toBeTruthy();
  });
});
