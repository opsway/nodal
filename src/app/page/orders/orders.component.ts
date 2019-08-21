import {
  Component,
} from '@angular/core';
import { ModelService } from '../../model/model.service';
import { Order } from '../../model/entity/order/order';
import { VirtualDateService } from '../../util/virtual-date.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
})
export class OrdersComponent {
  order = 'createdAt';
  reverse = false;

  constructor(
    public model: ModelService,
    private dateService: VirtualDateService,
  ) {
  }

  orderActions(order: Order) {
    return this.model.orderActions(order, this.dateService.getDate());
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }
}
