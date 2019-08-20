import {
  Component,
  OnInit,
} from '@angular/core';
import {
  DatePipe,
} from '@angular/common';
import { ModelService } from '../../../model/model.service';
import { VirtualDateService } from '../../../util/virtual-date.service';

@Component({
  selector: 'app-create-settlement',
  templateUrl: 'create-settlement.component.html',
  providers: [
    DatePipe,
  ]
})
export class CreateSettlementComponent implements OnInit {
  paymentGateway: string;

  constructor(
    private datePipe: DatePipe,
    public model: ModelService,
    private dateService: VirtualDateService,
  ) {
  }

  ngOnInit() {
    this.paymentGateway = this.model.paymentMethods[0];

  }

  toSettlement(): boolean {
    this.model.toSettlement(this.paymentGateway, this.dateService.getDate());
    return false;
  }
}
