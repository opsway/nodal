import {
  Component,
} from '@angular/core';
import { ModelService } from '../../model/model.service';
import { ORDER_BY_PARAMS } from '../../util/constant';

@Component({
  selector: 'app-payments',
  templateUrl: 'payments.component.html',
})
export class PaymentsComponent {
  orderType = ORDER_BY_PARAMS.type;
  orderReverse = ORDER_BY_PARAMS.reverse;

  constructor(
    public model: ModelService,
  ) {
  }
}
