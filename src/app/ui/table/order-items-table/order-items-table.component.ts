import {
  Component,
  Input,
} from '@angular/core';
import {TableProvider} from '../table-provider';
import {OrderItem} from '../../../model/order-item/order-item';
import {ConvertPipe} from '../../../util/convert.pipe';
import {TableCellDef} from '../table-cell-def';
import {Order} from '../../../model/order/order';

@Component({
  selector: 'app-order-items-table',
  templateUrl: 'order-items-table.component.html',
})
export class OrderItemsTableComponent {
  @Input() data: Order;
  @Input() isNested = false;

  get defaultColumns(): TableCellDef[] {
    return [
      TableProvider.cellDef('sellerName')
        .withHeader('Seller'),
      TableProvider.cellDef('sku')
        .withHeader('SKU'),
      TableProvider.cellDef('price')
        .withFooter('')
        .withPipe(new ConvertPipe()),
      TableProvider.cellDef('qty')
        .withFooter('Total'),
      TableProvider.cellDef('amountShipping')
        .withHeader('total shipping')
        .withPipe(new ConvertPipe())
        .withFooter(this.data ? this.data.amountShipping : 0),
      TableProvider.cellDef('total')
        .withHeader('total price')
        .withPipe(new ConvertPipe())
        .withFooter(this.data ? this.data.total : 0),
      TableProvider.cellDef('feeMarket')
        .withHeader('total fee')
        .withPipe(new ConvertPipe())
        .withFooter(this.data ? this.data.feeMarket : 0),
    ];
  }

  get provider(): TableProvider<OrderItem> {
    const columns = this.defaultColumns;
    if (this.isNested) {
      columns.push(TableProvider.cellDef('status'));
    }
    return new TableProvider<OrderItem>(
      this.data.items || [],
      columns,
    );
  }
}
