import {Injectable} from '@angular/core';
import {PaymentService} from './payment/payment.service';
import {OrderService} from './order/order.service';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
  ) {
  }

  get payments() {
    return this.paymentService;
  }

  get orders() {
    return this.orderService;
  }
}
