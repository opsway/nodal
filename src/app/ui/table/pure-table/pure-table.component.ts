import {
  Component,
  Input,
} from '@angular/core';
import {TableProvider} from '../table-provider';
import {OrderItem} from '../../../model/order-item/order-item';

@Component({
  selector: 'app-pure-table',
  templateUrl: 'pure-table.component.html',
})
export class PureTableComponent {
  @Input() provider: TableProvider<OrderItem>;
}
