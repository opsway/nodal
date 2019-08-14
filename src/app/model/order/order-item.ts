import {Item} from '../item/item';
import {Merchant} from '../member/merchant';
import {Order} from './order';

const feeMarketPercent = 7;
const feeMarketGST = 18;

export class OrderItem {
  id: string;
  item: Item;
  qty: number;
  shippingPrice: number;
  merchant: Merchant;
  refunded: boolean;
  order: Order;

  constructor(
    item: Item,
    merchant: Merchant,
    order: Order = null,
  ) {
    this.id = OrderItem.genId(
      order,
      merchant,
      item,
    );
    this.item = item;
    this.merchant = merchant;
    this.order = order;
    this.qty = 0;
    this.shippingPrice = order.customer.shippingPrice;
    this.refunded = false;
  }

  static genId(
    order: Order,
    merchant: Merchant,
    item: Item,
  ): string {
    return `${order.id}-${merchant.id}-${item.id}`;
  }

  get amount(): number {
    return this.refunded ? 0 : this.item.price * this.qty;
  }

  get amountShipping(): number {
    return this.shippingPrice * this.qty;
  }

  get feeMarket(): number {
    return this.refunded ? 0 : Math.floor((feeMarketPercent / 100) * this.amount) * (feeMarketGST / 100 + 1);
  }

  get amountMerchant(): number {
    return this.amount - this.feeMarket;
  }

  get total(): number {
    return this.amount + this.amountShipping;
  }

  refund(): number {
    let refund = 0;
    if (!this.refunded && this.order.payment && this.order.payment.captured) {
      this.merchant.balance -= refund = this.amountMerchant;
    }
    this.refunded = true;
    return refund;
  }
}
