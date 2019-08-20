import { DateFormatPipe } from './date-format.pipe';
import { Model } from '../model/model';

describe('DateFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new DateFormatPipe();
    expect(pipe).toBeTruthy();
  });
  it('transform', () => {
    const pipe = new DateFormatPipe();
    expect(pipe.transform(null)).toEqual('');
    Model.dateFormat = 'M/d h:mm';
    expect(pipe.transform(new Date('1985-10-05T06:00:00'))).toEqual('10/5 6:00');
  });
});
