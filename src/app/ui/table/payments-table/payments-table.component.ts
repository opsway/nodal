import {
  Component,
  Input,
} from '@angular/core';
import { ConvertPipe } from '../../../util/convert.pipe';
import { DateFormatPipe } from '../../../util/date-format.pipe';
import { TableProvider } from '../table-provider';
import { TableCellDef } from '../table-cell-def';
import { Payment } from '../../../model/entity/payment';

@Component({
  selector: 'app-payments-table',
  templateUrl: 'payments-table.component.html',
})
export class PaymentsTableComponent {
  @Input() data: Payment[];

  get defaultColumns(): TableCellDef[] {
    return [
      TableProvider.cellDef('id')
        .withHeader('ID'),
      TableProvider.cellDef('orderId')
        .withHeader('ORDER'),
      TableProvider.cellDef('createdAt')
        .withPipe(new DateFormatPipe())
        .withHeader('DATE'),
      TableProvider.cellDef('gateway')
        .withHeader('METHOD'),
      TableProvider.cellDef('total')
        .withPipe(new ConvertPipe())
        .withHeader('TOTAL'),
      TableProvider.cellDef('totalRefund')
        .withPipe(new ConvertPipe())
        .withHeader('Refunded'),
      TableProvider.cellDef('feeGateway')
        .withPipe(new ConvertPipe())
        .withHeader('GW Fee'),
      TableProvider.cellDef('settledAt')
        .withPipe(new DateFormatPipe())
        .withHeader('Settled at'),
    ];
  }

  get provider(): TableProvider<Payment> {
    const columns = this.defaultColumns;

    return new TableProvider<Payment>(
      this.data,
      columns,
    );
  }
}
