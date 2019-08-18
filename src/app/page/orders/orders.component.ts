import {
  Component,
} from '@angular/core';
import { ModelService } from '../../model/model.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
})
export class OrdersComponent {
  constructor(
    public model: ModelService,
  ) {
  }
}
