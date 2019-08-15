import {Injectable} from '@angular/core';
import {PaymentService} from './payment/payment.service';
import {OrderService} from './order/order.service';
import {SellerService} from './member/seller/seller.service';
import {CustomerService} from './member/customer/customer.service';
import {Shared} from './shared';
import {OrderItemService} from './order-item/order-item.service';
import {ItemService} from './item/item.service';

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

  flow(): void {
    // 1. Order flow
    const cart = this.orderService.currentCart();
    cart.customer = this.customerService.first();

    this.orderItemService.create(
      200,
      this.itemService.first(),
      50,
      2,
      this.sellerService.first(),
      cart,
    );

     // 2. Payment flow
    cart.checkout();

    // TODO add create invoice (No, Total, Date) by item via Seller
    // TODO add setted cancel (reject)
    // TODO add setted status ship (reject)
    // TODO add setted status returned etc
    // TODO add remay ???
    this.paymentService.toPay(cart, 'pytm');

    // TODO add refunds before gateway settlement
    // 3. Settlement flow
    this.paymentService.gatewaySettlement('pytm', (new Date()));

    // TODO add refunds after checkout
    this.paymentService.nodalSettlement();
  }
}
