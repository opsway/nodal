import { Component, Input, OnInit } from '@angular/core';
import { ModelService } from '../../../model/model.service';
import { Invoice } from '../../../model/entity/invoice';
import { Order } from '../../../model/entity/order/order';

@Component({
  selector: 'invoice-actions',
  templateUrl: './invoice-actions.component.html',
})
export class InvoiceActionsComponent implements OnInit {
  @Input() invoice: Invoice;
  @Input() order: Order;
  constructor(
    public model: ModelService,
  ) { }

  ngOnInit() {
  }

}
