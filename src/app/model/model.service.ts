import {Injectable, PipeTransform} from '@angular/core';
import {PaymentService} from './payment/payment.service';
import {OrderService} from './order/order.service';
import {SellerService} from './member/seller/seller.service';
import {CustomerService} from './member/customer/customer.service';
import {Shared} from './shared';
import {OrderItemService} from './order-item/order-item.service';
import {ItemService} from './item/item.service';
import {OrderItem} from './order-item/order-item';
import {TableProvider} from '../ui/table/table-provider';
import {Customer} from './member/customer/customer';
import {Item} from './item/item';
import {Seller} from './member/seller/seller';
import {Order} from './order/order';
import {ConvertPipe} from '../util/convert.pipe';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor(
    private itemService: ItemService,
    private orderItemService: OrderItemService,
    private customerService: CustomerService,
    private sellerService: SellerService,
    private orderService: OrderService,
    private paymentService: PaymentService,
  ) {
  }

  get items(): Item[] {
    return this.itemService.all();
  }

  get payments() {
    return this.paymentService;
  }

  get orders() {
    return this.orderService;
  }

  import(content: string): boolean {
    let data = null;
    try {
      data = JSON.parse(atob(content));
    } catch (e) {
      return false;
    }

    // TODO import data.customers
    // TODO import data.sellers
    // TODO import orders
    // TODO import order items
    // TODO import payments
    console.log(data); // TODO import model

    return true;
  }

  export(): string {
    const data: Shared = {
      customers: [],
      sellers: [],
    };

    data.customers = this.customerService.all();
    data.sellers = this.sellerService.all();
    // TODO export orders
    // TODO export order items
    // TODO export payments

    const content = JSON.stringify(data);

    return `${window.location.origin}/${btoa(content)}`;
  }

  share(): void {
    // this.flow(); // FIXME remove it
    const url = this.export();
    console.log(url);
    window.location.href = url;
  }

  saveOrder(): Order {
    const cart = this.orderService.currentCart();
    if (cart.save()) {
      return this.orderService.create(cart.customer);
    }

    return cart;
  }

  addToCart(
    customer: Customer,
    price: number,
    item: Item,
    priceShipping: number,
    qty: number,
    seller: Seller,
  ): OrderItem {
    const cart = this.orderService.currentCart();
    cart.customer = customer;


    return cart.addItem(this.orderItemService.create(
      price,
      item,
      priceShipping,
      qty,
      seller,
      cart,
    ));
  }

  flow(): void {
    // 1. Order flow
    // 1.1. Edit order
    const order = this.addToCart(
      this.customerService.first(),
      200,
      this.itemService.first(),
      50,
      2,
      this.sellerService.first(),
    ).order;
    // 1.2. Save order
    this.saveOrder();

    // 2. Payment flow
    // TODO add create invoice (No, Total, Date) by item via Seller
    // TODO add setted cancel (reject)
    // TODO add setted status ship (reject)
    // TODO add setted status returned etc
    // TODO add remay ???
    this.paymentService.toPay(order, 'pytm');

    // TODO add refunds before gateway settlement
    // 3. Settlement flow
    this.paymentService.gatewaySettlement('pytm', (new Date()));

    // TODO add refunds after checkout
    this.paymentService.nodalSettlement();
  }
}
