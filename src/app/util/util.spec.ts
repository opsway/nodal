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
});
