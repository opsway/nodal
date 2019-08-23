import {
  Component
} from '@angular/core';
import { ModelService } from '../../model/model.service';
import { VirtualDateService } from '../../util/virtual-date.service';

@Component({
  templateUrl: 'history.component.html',
})
export class HistoryComponent {
  constructor(
    public model: ModelService,
    private dateService: VirtualDateService,
  ) {
  }

  public historyHeaders = [
    '#',
    'DATE',
    'Action',
    'Amount',
  ];

  get accountHeaders() {
    return this.model.accountBalances(this.dateService.getDate()).map(value => value.name);
  }

  get headers() {
    return [
      ...this.historyHeaders,
      ...this.accountHeaders,
    ];
  }

  get footers() {
    return [].concat(...this.model.accountBalances(this.dateService.getDate()).map(value => value.balance));
  }

  get data() {
    return this.model.history.all();
  }

  get isEmpty() {
    return this.model.history.count() === 0;
  }
}
