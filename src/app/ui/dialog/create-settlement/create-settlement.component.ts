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
    private model: ModelService,
    private dateService: VirtualDateService,
  ) {
  }

  ngOnInit() {
    this.paymentGateway = this.model.paymentGateways[0];
  }

  get paymentGateways() {
    return this.model.paymentGateways;
  }

  get catSettlement() {
    return this.model.catGatewaySettlement(this.paymentGateway, this.dateService.getDate());
  }

  doSettlement(): boolean {
    this.model.doGatewaySettlement(this.paymentGateway, this.dateService.getDate());
    return false;
  }
}
