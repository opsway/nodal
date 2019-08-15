import {Item} from '../item/item';
import {Seller} from '../member/seller/seller';
import {Order} from '../order/order';

const feeMarketPercent = 7;
const feeMarketGST = 18;

export class OrderItem {
  id: string;
  item: Item;
  qty: number;
  shippingPrice: number;
  seller: Seller;
  refunded: boolean;
  order: Order;

  constructor(
    item: Item,
    seller: Seller,
    order: Order = null,
  ) {
    this.id = OrderItem.genId(
      order,
      seller,
      item,
    );
    this.item = item;
    this.seller = seller;
    this.order = order;
    this.qty = 0;
    this.shippingPrice = order.customer.shippingPrice;
    this.refunded = false;
  }

  static genId(
    order: Order,
    seller: Seller,
    item: Item,
  ): string {
    return `${order.id}-${seller.id}-${item.id}`;
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

  get amountSeller(): number {
    return this.amount - this.feeMarket;
  }

  get total(): number {
    return this.amount + this.amountShipping;
  }

  refund(): number {
    let refund = 0;
    if (!this.refunded && this.order.payment && this.order.payment.captured) {
      this.seller.balance -= refund = this.amountSeller;
    }
    this.refunded = true;
    return refund;
  }
}
