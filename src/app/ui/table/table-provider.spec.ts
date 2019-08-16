import {TableProvider} from './table-provider';
import {ConvertPipe} from '../../util/convert.pipe';

describe('TableProvider', () => {
  it('should create an instance', () => {
    const provider = new TableProvider<any>(
      [
        {
          foo: 100,
          bar: 100,
        },
      ],
      [
        TableProvider.cellDef('foo', [
          new ConvertPipe(),
        ]),
        TableProvider.cellDef('bar'),
      ],
    );

    expect(provider.fields).toEqual([
      'foo',
      'bar',
    ]);
    expect(provider.rows).toEqual([
      [
        '₹1.00',
        100,
      ],
    ]);
  });
});
