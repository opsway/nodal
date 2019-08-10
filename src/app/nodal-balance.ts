import {Merchant} from './merchant';
import {Payment} from './payment';
import {OrderItem} from './order-item';

export class NodalBalance {
  total = 0;
  market = 0;
  merchant = 0;
  private collection: Map<string, Merchant>;

  constructor() {
    this.collection = new Map();
  }

  increment(payment: Payment): void {
    this.total += payment.total;
    this.market += payment.totalMarket;
    this.merchant += payment.total - payment.totalMarket;

    payment.order.items.forEach((orderItem: OrderItem) => {
      if (!this.collection.has(orderItem.merchant.id)) {
        this.collection.set(orderItem.merchant.id, orderItem.merchant);
      }
      this.collection.get(orderItem.merchant.id).balance += orderItem.amountMerchant;
    });
  }

  get merchants(): Merchant[] {
    return Array.from(this.collection.values());
  }
}
