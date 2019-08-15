import {
  Component,
  Input,
} from '@angular/core';
import {Payment} from '../../model/payment/payment';

@Component({
  selector: 'app-payment-list',
  templateUrl: 'payment-list.component.html',
  styleUrls: [
    'payment-list.component.css',
  ],
})
export class PaymentListComponent {
  @Input() dataSource: Payment[] = [];
  @Input() displayedColumns: string[] = [
    'id',
    'createdAt',
  ];
}
