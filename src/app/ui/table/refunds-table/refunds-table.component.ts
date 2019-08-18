import {
  Component,
  Input,
} from '@angular/core';
import { ConvertPipe } from '../../../util/convert.pipe';
import { DateFormatPipe } from '../../../util/date-format.pipe';
import { TableProvider } from '../table-provider';
import { TableCellDef } from '../table-cell-def';
import { Refund } from '../../../model/entity/refund';

@Component({
  selector: 'app-refunds-table',
  templateUrl: 'refunds-table.component.html',
})
export class RefundsTableComponent {
  @Input() data: Refund[];

  get defaultColumns(): TableCellDef[] {
    return [
      TableProvider.cellDef('id')
        .withHeader('ID'),
      TableProvider.cellDef('orderId')
        .withHeader('ORDER'),
      TableProvider.cellDef('createdAt')
        .withPipe(new DateFormatPipe())
        .withHeader('DATE'),
      TableProvider.cellDef('method')
        .withHeader('METHOD'),
      TableProvider.cellDef('total')
        .withPipe(new ConvertPipe())
        .withHeader('Refunded TOTAL'),
    ];
  }

  get provider(): TableProvider<Refund> {
    const columns = this.defaultColumns;

    return new TableProvider<Refund>(
      this.data,
      columns,
    );
  }
}
