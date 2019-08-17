import {
  Injectable,
} from '@angular/core';
import {PaymentService} from './payment/payment.service';
import {OrderService} from './order/order.service';
import {SellerService} from './member/seller/seller.service';
import {CustomerService} from './member/customer/customer.service';
import {Shared} from './shared';
import {OrderItemService} from './order-item/order-item.service';
import {ItemService} from './item/item.service';
import {OrderItem} from './order-item/order-item';
import {Item} from './item/item';
import {Order} from './order/order';

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

  get orders(): Order[] {
    return this.orderService.all();
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

  addOrderItem(
    customerId: string,
    price: number,
    itemId: string,
    priceShipping: number,
    qty: number,
    sellerId: string,
  ): OrderItem {
    const customer = this.customerService.find(customerId);
    const item = this.itemService.find(itemId);
    const seller = this.sellerService.find(sellerId);
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
    const order = this.addOrderItem(
      this.customerService.first().id,
      200,
      this.itemService.first().id,
      50,
      2,
      this.sellerService.first().id,
    ).order;
    // 1.2. Save order
    this.saveOrder();
    // TODO 1.3. Cancel Order
    // TODO 1.4. Pay Order
    // TODO 1.5. Create invoice for payed Order by item via Seller

    // 2. Payment flow
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
