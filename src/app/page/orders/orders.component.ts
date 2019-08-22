import {
  Component,
} from '@angular/core';
import { ModelService } from '../../model/model.service';
import { Order } from '../../model/entity/order/order';
import { InvoiceItems } from '../../model/aggregate/invoice-items';
import { VirtualDateService } from '../../util/virtual-date.service';
import { ORDER_BY_PARAMS } from '../../util/constant';
import { ToastsService } from '../../ui/toasts/toasts.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
})
export class OrdersComponent {
  orderType = ORDER_BY_PARAMS.type;
  orderReverse = ORDER_BY_PARAMS.reverse;

  constructor(
    public model: ModelService,
    public toastService: ToastsService,
    private dateService: VirtualDateService,
  ) {
  }

  orderActions(order: Order) {
    return this.model.orderActions(order, this.dateService.getDate());
  }

  processAction(order: Order, action) {
    const now = this.dateService.getDate();
    if (order.createdAt.getTime() > now.getTime()) {
      let actionType = '';
      if (order.isNoPaid) {
        actionType = 'pay';
      } else if (order.canInvoice) {
        actionType = 'invoice';
      } else if (order.canCanceled) {
        actionType = 'cancel';
      } else if (order.canReturned) {
        actionType = 'return';
      } else if (order.canRefund) {
        actionType = 'refund';
      }
      this.toastService.show(`You can\'t make ${actionType}`, {
        classname: 'bg-danger text-light toast-top-center text-center',
      });
      return;
    } else {
      action.handler();
    }
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
