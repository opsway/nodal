import {
  Component,
  Input,
} from '@angular/core';
import { Transfer } from '../../../model/entity/transfer';
import { TableProvider } from '../table-provider';
import { DateFormatPipe } from '../../../util/date-format.pipe';
import { ConvertPipe } from '../../../util/convert.pipe';
import { ModelService } from '../../../model/model.service';

@Component({
  selector: 'app-account-balances-table',
  templateUrl: 'account-balances-table.component.html',
})
export class AccountBalancesTableComponent {
  @Input() holder: string;
  @Input() hasSettlement = false;

  constructor(
    private model: ModelService,
  ) {
  }

  private defaultColumns = [
    TableProvider.cellDef('ref')
      .withHeader('REF'),
    TableProvider.cellDef('createdAt')
      .withPipe(new DateFormatPipe())
      .withHeader('DATE'),
    TableProvider.cellDef('amount')
      .withPipe(new ConvertPipe())
      .withHeader('Amount'),
    TableProvider.cellDef('balance')
      .withPipe(new ConvertPipe())
      .withHeader('Balance'),
  ];

  get count(): number {
    return this.data.count();
  }

  get balance() {
    return this.model.balanceByHolder(this.holder);
  }

  get data() {
    return this.model.transfers.filter(entity => entity.holder === this.holder);
  }

  get provider(): TableProvider<Transfer> {
    const columns = this.defaultColumns;

    return new TableProvider<Transfer>(
      this.data.all(),
      columns,
    );
  }
}
