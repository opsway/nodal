import {
  Component,
} from '@angular/core';
import { ModelService } from '../../model/model.service';
import { VirtualDateService } from '../../util/virtual-date.service';

@Component({
  selector: 'app-nodal',
  templateUrl: 'nodal.component.html',
})
export class NodalComponent {
  constructor(
    private model: ModelService,
    private dateService: VirtualDateService,
  ) {
  }

  get nodalAccounts() {
    return this.model.nodalAccounts.filter(value => value !== ModelService.NodalMarket);
  }

  get sellers() {
    return this.model.sellers.all();
  }

  get canMarketSettlement(): boolean {
    return this.model.canMarketSettlement(this.dateService.getDate());
  }

  marketSettlement(): void {
    this.model.doMarketSettlement(this.dateService.getDate());
  }
}
