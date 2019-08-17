import {
  Injectable,
} from '@angular/core';
import {PaymentService} from './payment/payment.service';
import {OrderService} from './order/order.service';
import {SellerService} from './member/seller/seller.service';
import {CustomerService} from './member/customer/customer.service';
import {Shared} from './shared';
import {OrderItemService} from './order-item/order-item.service';
import {OrderItem} from './order-item/order-item';
import {Item} from './entity/item';
import {Order} from './order/order';
import {Collection} from './collection';
import {meta} from '../../app/app.meta';
import {Invoice} from './entity/invoice';
import {Seller} from './member/seller/seller';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private itemCollection: Collection<Item> = new Collection<Item>();
  private invoiceCollection: Collection<Invoice> = new Collection<Invoice>();

  constructor(
    private orderItemService: OrderItemService,
    private customerService: CustomerService,
    private sellerService: SellerService,
    private orderService: OrderService,
    private paymentService: PaymentService,
  ) {
    this.load();
    if (meta.releaseNumber === 'local') {
      this.flow();
    }
  }

  load(): void {
    this.itemCollection.load([
      new Item(),
      new Item(),
      new Item(),
      new Item(),
    ]);
  }

  get currentOrder(): Order {
    return this.orderService.currentOrder();
  }

  invoicesByOrder(o: Order): Collection<Invoice> {
    console.log(this.invoiceCollection.all());
    return this.invoiceCollection
      .filter(e => e.hasOrder(o));
  }

  createInvoice(o: OrderItem): Invoice {
    const invoice = this.invoiceCollection.add(new Invoice(o.seller));
    invoice.items.add(o);

    return invoice;
  }

  currentInvoice(o: OrderItem): Invoice {
    const invoice = this.invoiceCollection
      .filter(e => e.createdAt === null && e.seller.id === o.seller.id)
      .first();
    if (invoice) {
      invoice.items.add(o);
      return invoice;
    }

    return this.createInvoice(o);
  }

  get customers(): CustomerService {
    return this.customerService;
  }

  get sellers(): SellerService {
    return this.sellerService;
  }

  get items(): Collection<Item> {
    return this.itemCollection;
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

  toPay(order: Order, gateway: string): void {
    this.paymentService.toPay(order, gateway);
  }

  toInvoiceOrderItem(orderItem: OrderItem): OrderItem {
    return orderItem.attacheInvoice(this.currentInvoice(orderItem));
  }

  toInvoiceOrder(order: Order): Order {
    order.items.forEach(item => {
      this.toInvoiceOrderItem(item);
    });
    this.invoiceCollection
      .filter(entity => entity.isDraft)
      .walk(entity => entity.save());

    return order;
  }

  saveOrder(): boolean {
    const cart = this.orderService.currentOrder();
    if (cart.save().isSaved) {
      this.orderService.create(cart.customer);
      return true;
    }

    return false;
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
    const item = this.items.find(itemId);
    const seller = this.sellerService.find(sellerId);
    const cart = this.orderService.currentOrder();
    cart.customer = customer;
    console.log(`${cart.id} addOrderItem:`, customer, item, seller);
    return cart.addItem(this.orderItemService.create(
      price,
      item,
      priceShipping,
      qty,
      seller,
      cart,
    ));
  }

  private flowEditNewOrder(): Order {
    this.addOrderItem(
      this.customerService.first().id,
      200,
      this.items.first().id,
      50,
      2,
      this.sellerService.all()[1].id,
    );
    return this.addOrderItem(
      this.customerService.first().id,
      200,
      this.items.first().id,
      50,
      2,
      this.sellerService.first().id,
    ).order;
  }

  private flow(): void {
    // 1. Order flow
    let order: Order = null;
    // 1.1. Edit new Order
    this.flowEditNewOrder();
    // 1.2. Save order
    this.saveOrder();
    // 1.3. Pay Order
    this.toPay(this.flowEditNewOrder().save(), 'RP');
    // 1.4. Create invoice for payed Order by item via Seller
    order = this.flowEditNewOrder().save();
    this.toPay(order, 'RP');
    this.toInvoiceOrder(order);
    // 1.5. Ship invoice
    // TODO add cases for statuses
    // 1.6. Cancel invoice
    // TODO add cases for statuses
    // 1.7. Return item
    // TODO add cases for statuses
    // 1.8. Refund item
    // TODO add cases for statuses

    // 2. Payment flow
    // TODO add setted cancel (reject)
    // TODO add setted status ship (reject)
    // TODO add setted status returned etc
    // TODO add remay ???
    // ;

    // TODO add refunds before gateway settlement
    // 3. Settlement flow
    // this.paymentService.gatewaySettlement('pytm', (new Date()));

    // TODO add refunds after checkout
    // this.paymentService.nodalSettlement();
  }
}
