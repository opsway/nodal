import * as Util from '../../util/util';
import {Item} from '../item/item';
import {Seller} from '../member/seller/seller';
import {Order} from '../order/order';
import {Model} from '../model';
import {ConvertPipe} from '../../util/convert.pipe';

export class OrderItem {
  id: string;
  item: Item;
  qty: number;
  price: number;
  priceShipping: number;
  seller: Seller;
  refunded: boolean;
  order: Order;

  constructor(
    price: number, item: Item, // SellerItem
    priceShipping: number,
    qty: number,
    seller: Seller,
    order: Order = null,
  ) {
    this.id = Util.uuid('OI');
    this.item = item;
    this.seller = seller;
    this.order = order;
    this.qty = qty;
    this.price = priceShipping * Model.precisionOfPersist;
    this.priceShipping = priceShipping *  Model.precisionOfPersist;
    this.refunded = false;
  }

  static genId(
    order: Order,
    seller: Seller,
    item: Item,
  ): string {
    return `${order.id}-${seller.id}-${item.id}`;
  }

  get priceFormatted(): string {
    return (new ConvertPipe()).transform(this.price);
  }

  get priceShippingFormatted(): string {
    return (new ConvertPipe()).transform(this.priceShipping);
  }

  get amount(): number {
    return this.refunded ? 0 : this.item.price * this.qty;
  }

  get amountShipping(): number {
    return this.priceShipping * this.qty;
  }

  get feeMarket(): number {
    return this.refunded ? 0 : Math.floor((Model.feeMarketPercent / 100) * this.amount) * (Model.feeMarketGST / 100 + 1);
  }

  get amountSeller(): number {
    return this.amount - this.feeMarket;
  }

  get sku(): string {
    return this.item.id;
  }

  get sellerName(): string {
    return this.seller.name;
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
