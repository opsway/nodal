import * as Util from './util';

describe('Util', () => {
  beforeEach(() => {
    Util.sequenceClear();
  });
  it('uuid: should uniq an sequence', () => {
    expect(Util.uuid()).toEqual('1');
    expect(Util.uuid('NC')).toEqual('NC1');
    expect(Util.uuid('NC')).toEqual('NC2');
  });
});
