import {
  Component,
  Input,
} from '@angular/core';
import {TableProvider} from '../table-provider';
import {OrderItem} from '../../../model/order-item/order-item';
import {ConvertPipe} from '../../../util/convert.pipe';

@Component({
  selector: 'app-order-items-table',
  templateUrl: 'order-items-table.component.html',
})
export class OrderItemsTableComponent {
  @Input() data: OrderItem[];
  @Input() isNested = false;

  get provider(): TableProvider<OrderItem> {
    const order = this.data[0] ? this.data[0].order : null;
    return new TableProvider<OrderItem>(
      this.data,
      [
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
          .withFooter(order ? order.amountShipping : 0),
        TableProvider.cellDef('total')
          .withHeader('total price')
          .withPipe(new ConvertPipe())
          .withFooter(order ? order.total : 0),
        TableProvider.cellDef('feeMarket')
          .withHeader('total fee')
          .withPipe(new ConvertPipe())
          .withFooter(order ? order.feeMarket : 0),
      ],
    );
  }
}
