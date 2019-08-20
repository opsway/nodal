import { Invoice } from '../entity/invoice';
import { OrderItem } from '../entity/order/order-item';

export class InvoiceItems {
  constructor(
    public invoice: Invoice,
    public items: OrderItem[] = [],
  ) {
  }
}
