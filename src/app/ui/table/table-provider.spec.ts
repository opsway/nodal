import {TableProvider} from './table-provider';
import {ConvertPipe} from '../../util/convert.pipe';
import {TableCellValue} from './table-cell-value';

describe('TableProvider', () => {
  it('should create an instance', () => {
    const provider = new TableProvider<any>(
      [
        {
          foo: 100,
          bar: 200,
        },
        {
          foo: 50,
          bar: 25,
        },
      ],
      [
        TableProvider.cellDef('foo')
          .withPipe(new ConvertPipe()),
        TableProvider.cellDef('bar')
          .withFooter(225),
        TableProvider.cellDef('bar')
          .withHeader('bar pipe')
          .withPipe(new ConvertPipe())
          .withFooter(225),
      ],
    );

    expect(provider.headers).toEqual([
      'foo',
      'bar',
      'bar pipe',
    ]);
    expect(provider.rows).toEqual([
      [
        '₹1.00',
        200,
        '₹2.00',
      ],
      [
        '₹0.50',
        25,
        '₹0.25',
      ],
    ]);
    expect(provider.footers).toEqual([
      new TableCellValue(225, 2),
      new TableCellValue('₹2.25', 1),
    ]);
  });
});
