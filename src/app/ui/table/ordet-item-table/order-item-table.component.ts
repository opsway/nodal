import {
  Component, Input,
  OnInit,
} from '@angular/core';
import {TableProvider} from '../table-provider';
import {OrderItem} from '../../../model/order-item/order-item';

@Component({
  selector: 'app-order-item-table',
  templateUrl: 'order-item-table.component.html',
})
export class OrderItemTableComponent implements OnInit {
  @Input() provider: TableProvider<OrderItem>;
  constructor() {}

  ngOnInit() {
  }

}
