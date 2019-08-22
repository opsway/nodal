import * as Util from './util';

describe('Util', () => {
  beforeEach(() => {
    Util.sequenceClear();
  });

  it('uuid: should uniq an sequence', () => {
    expect(Util.uuid()).toEqual('_1');
    expect(Util.uuid('NS')).toEqual('NS_1');
    expect(Util.uuid('NS')).toEqual('NS_2');
  });

  it('dateToString', () => {
    const actual = Util.dateToString(new Date('1985-10-06T06:00:00'));
    expect(actual).toEqual('1985-10-06T06:00:00');
  });
});
