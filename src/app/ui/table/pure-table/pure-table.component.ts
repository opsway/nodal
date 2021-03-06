import {
  Component,
  Input,
} from '@angular/core';
import { TableProvider } from '../table-provider';

@Component({
  selector: 'app-pure-table',
  templateUrl: 'pure-table.component.html',
})
export class PureTableComponent {
  @Input() provider: TableProvider<any>;
  @Input() showHeader = true;
  @Input() showFooter = true;

  get hasFooter(): boolean {
    return this.showFooter && this.provider.footers.length > 0;
  }

  get isEmpty(): boolean {
    return this.provider.rows.length === 0;
  }
}
