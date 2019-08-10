import * as Util from './util';

describe('Util', () => {
  it('uuid: should uniq an sequence', () => {
    expect(Util.uuid('NC')).toEqual('NC1');
    expect(Util.uuid('NC')).toEqual('NC2');
  });
});
