import {
  Component,
} from '@angular/core';
import { ModelService } from '../../model/model.service';
import { Order } from '../../model/entity/order/order';
import { InvoiceItems } from '../../model/aggregate/invoice-items';
import { VirtualDateService } from '../../util/virtual-date.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
})
export class OrdersComponent {
  orderType = 'createdAt';
  orderReverse = false;

  constructor(
    public model: ModelService,
    private dateService: VirtualDateService,
  ) {
  }

  orderActions(order: Order) {
    return this.model.orderActions(order, this.dateService.getDate());
  }

  getSortedGroup(order: Order): InvoiceItems[] {
    return order.groupByInvoiceItems
      .sort((a, b) => {
        if (a.invoice && a.invoice.createdAt && b.invoice && b.invoice.createdAt) {
          return this.orderReverse ? b.invoice.createdAt.getTime() - a.invoice.createdAt.getTime() :
            a.invoice.createdAt.getTime() - b.invoice.createdAt.getTime();
        } else {
          if ((a.invoice && !a.invoice.createdAt && b.invoice && !b.invoice.createdAt) || (!a.invoice && !b.invoice)) {
            return 0;
          }
          return this.orderReverse && b.invoice && b.invoice.createdAt ? -1 : 1;
        }
      });
  }
}
