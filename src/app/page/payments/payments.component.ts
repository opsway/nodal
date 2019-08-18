import {
  Component,
} from '@angular/core';
import { ModelService } from '../../model/model.service';

@Component({
  selector: 'app-payments',
  templateUrl: 'payments.component.html',
})
export class PaymentsComponent {
  constructor(
    public model: ModelService,
  ) {
  }
}
