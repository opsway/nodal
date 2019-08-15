import {Seller} from '../member/seller/seller';
import {Payment} from '../payment/payment';
import {OrderItem} from '../order-item/order-item';

export class NodalBalance {
  total = 0;
  market = 0;
  seller = 0;
  private collection: Map<string, Seller>;

  constructor() {
    this.collection = new Map();
  }

  increment(payment: Payment): void {
    this.total += payment.total;
    this.market += payment.totalMarket;
    this.seller += payment.total - payment.totalMarket;

    payment.order.items.forEach((orderItem: OrderItem) => {
      if (!this.collection.has(orderItem.seller.id)) {
        this.collection.set(orderItem.seller.id, orderItem.seller);
      }
      this.collection.get(orderItem.seller.id).balance += orderItem.amountSeller;
    });
  }

  get sellers(): Seller[] {
    return Array.from(this.collection.values());
  }
}
