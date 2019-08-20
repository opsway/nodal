import {
  Component,
} from '@angular/core';
import { ModelService } from '../../model/model.service';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
})
export class OrdersComponent {
  order = 'createdAt';
  reverse = false;

  constructor(
    public model: ModelService,
    private orderPipe: OrderPipe,
  ) {
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }
}
