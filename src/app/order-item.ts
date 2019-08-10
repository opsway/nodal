import {Item} from './item';
import {Merchant} from './merchant';
import {Payment} from './payment';

const feeMarketPercent = 7;

export class OrderItem {
  id: string;
  item: Item;
  qty: number;
  merchant: Merchant;
  refunded: boolean;
  payment: Payment;

  constructor(item: Item, merchant: Merchant) {
    this.id = OrderItem.genId(item, merchant);
    this.item = item;
    this.merchant = merchant;
    this.qty = 1;
    this.refunded = false;
  }

  static genId(item: Item, merchant: Merchant): string {
    return `${item.id}-${merchant.id}`;
  }

  get amount(): number {
    return this.refunded ? 0 : this.item.price * this.qty;
  }

  get feeMarket(): number {
    return this.refunded ? 0 : Math.floor((feeMarketPercent / 100) * this.amount);
  }

  get amountMerchant(): number {
    return this.amount - this.feeMarket;
  }

  refund(): number {
    let refund = 0;
    if (!this.refunded && this.payment && this.payment.captured) {
      this.merchant.balance -= refund = this.amountMerchant;
    }
    this.refunded = true;
    return refund;
  }
}
