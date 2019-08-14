import { ConvertPipe } from './convert.pipe';

describe('ConvertPipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertPipe();
    expect(pipe).toBeTruthy();
  });
  it('transform', () => {
    const pipe = new ConvertPipe();
    expect(pipe.transform(12345)).toEqual('₹123.45');
  });
});
