import {
  Component,
  Input,
} from '@angular/core';
import { Transfer } from '../../../model/entity/transfer';
import { TableProvider } from '../table-provider';
import { DateFormatPipe } from '../../../util/date-format.pipe';
import { ConvertPipe } from '../../../util/convert.pipe';
import { ModelService } from '../../../model/model.service';
import { VirtualDateService } from '../../../util/virtual-date.service';
import { TransferBalance } from '../../../model/aggregate/transfer-balance';

@Component({
  selector: 'app-account-balances-table',
  templateUrl: 'account-balances-table.component.html',
})
export class AccountBalancesTableComponent {
  @Input() holder: string;
  @Input() hasSettlement = false;

  constructor(
    public model: ModelService,
    public dateService: VirtualDateService,
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
    return this.model.calcBalance(this.dateService.getDate(), this.holder);
  }

  get data() {
    return this.model.transfersWithBalanceByHolder(this.dateService.getDate(), this.holder);
  }

  get provider(): TableProvider<TransferBalance> {
    const columns = this.defaultColumns;

    return new TableProvider<TransferBalance>(
      this.data.all(),
      columns,
    );
  }
}
