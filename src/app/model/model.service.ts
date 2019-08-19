import {
  Injectable,
} from '@angular/core';
import { meta } from '../app.meta';
import { Shared } from './shared';
import { OrderItem } from './entity/order/order-item';
import { Item } from './entity/item';
import { Order } from './entity/order/order';
import { Collection } from './collection';
import { Invoice } from './entity/invoice';
import { Refund } from './entity/refund';
import { Model } from './model';
import { Settlement } from './entity/settlement';
import { Payment } from './entity/payment';
import { Seller } from './entity/member/seller';
import { Customer } from './entity/member/customer';
import { Transfer } from './entity/transfer';

declare interface Action {
  name: string;
  title: string;
  color: string;
  handler: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private static NodalBank = 'Bank';
  private static NodalGWFee = 'GW Fee';
  private static NodalMFFee = 'MF Fee';
  private customerCollection: Collection<Customer> = new Collection<Customer>();
  private sellerCollection: Collection<Seller> = new Collection<Seller>();
  private orderCollection: Collection<Order> = new Collection<Order>();
  private itemCollection: Collection<Item> = new Collection<Item>();
  private invoiceCollection: Collection<Invoice> = new Collection<Invoice>();
  private refundCollection: Collection<Refund> = new Collection<Refund>();
  private paymentCollection: Collection<Payment> = new Collection<Payment>();
  private settlementCollection: Collection<Settlement> = new Collection<Settlement>();
  private transferCollection: Collection<Transfer> = new Collection<Transfer>();
  private accountBalance: Map<string, number> = new Map();
  readonly paymentGateways: string[];

  constructor(
  ) {
    this.paymentGateways = Model.paymentGateways;
    this.load();
    if (meta.releaseNumber === 'local') {
      this.flow();
    }
  }

  load(): void {
    this.customerCollection.load([
      'A',
      'B',
      'C',
      'D',
      'F',
      'F',
      'G',
    ].map(name => new Customer(name)));

    this.sellerCollection.load([
      'TA',
      'SAAN',
      'RA',
      'CFC',
      'SWA',
    ].map(name => new Seller(name)));

    this.itemCollection.load([
      new Item(),
      new Item(),
      new Item(),
      new Item(),
    ]);
  }

  get transfers() {
    return this.transferCollection;
  }

  balanceByHolder(holder: string): number {
    return this.accountBalance.get(holder) || 0;
  }

  createTransaction(holder: string, ref: string, amount: number, date: Date) {
    console.log('createTransaction', holder, amount);
    const balance = this.balanceByHolder(holder) + amount;
    this.accountBalance.set(holder, balance);

    return this.transferCollection.add(new Transfer(holder, ref, amount, balance, date));
  }

  transferPayment(payment: Payment): void {
    this.createTransaction(payment.gateway, payment.id, payment.total, payment.createdAt);
  }

  transferRefund(refund: Refund) {
    return this.createTransaction(refund.gateway, refund.id, -refund.total, refund.createdAt);
  }

  transferSettlement(settlement: Settlement): void {
    this.createTransaction(settlement.gateway, settlement.id, -settlement.total, settlement.createdAt);
    this.createTransaction(ModelService.NodalBank, settlement.id, settlement.amount, settlement.createdAt);
    this.createTransaction(ModelService.NodalGWFee, settlement.id, settlement.fee, settlement.createdAt);
    this.createTransaction(ModelService.NodalMFFee, settlement.id, settlement.totalFeeMarket, settlement.createdAt);
  }

  get paymentMethods(): string[] {
    return this.paymentGateways;
  }

  get nodalAccounts(): string[] {
    return [
      ModelService.NodalBank,
      ModelService.NodalGWFee,
      ModelService.NodalMFFee,
    ];
  }

  get currentOrder(): Order {
    const match = this.orderCollection
      .filter(entity => entity.isNew).first();
    if (match) {
      return match;
    }

    return this.createOrder();
  }

  invoicesByOrder(o: Order): Collection<Invoice> {
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

  get settlements() {
    return this.settlementCollection;
  }

  createSettlement(paymentMethod: string, date: Date): Settlement {
    return this.settlementCollection.add(new Settlement(paymentMethod, date));
  }

  toSettlement(gateway: string, date: Date): void {
    const payments = this.notCapturedPaymentsByGateway(gateway, date);
    if (payments.count() > 0) {
      const settlement = this.createSettlement(gateway, date);
      payments.walk(entity => settlement.capture(entity));
      console.log('createSettlement', settlement);
      this.transferSettlement(settlement);
    }
    console.log('createSettlement not payments');
  }

  get customers() {
    return this.customerCollection;
  }

  get sellers() {
    return this.sellerCollection;
  }

  get items() {
    return this.itemCollection;
  }

  get payments() {
    return this.paymentCollection;
  }

  get notCapturedPayments() {
    return this.payments.filter(entity => !entity.isCaptured);
  }

  notCapturedPaymentsByGateway(gateway: string, date: Date = new Date()) {
    return this.notCapturedPayments
      .filter(entity => entity.gateway === gateway
        && entity.createdAt.getTime() <= date.getTime());
  }

  get refunds() {
    return this.refundCollection;
  }

  get orders() {
    return this.orderCollection
      .filter(entity => entity.isSaved);
  }

  createOrder(customer: Customer = null): Order {
    const order = new Order(customer);

    return this.orderCollection.add(order);
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

    data.customers = this.customers.all();
    data.sellers = this.sellers.all();
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

  orderActions(order: Order): Action[] {
    const actions = [];

    if (order.isNoPaid) {
      actions.push(...this.paymentMethods.map(gateway => {
        return {
          name: gateway,
          title: `pay by ${gateway}`,
          color: 'primary',
          handler: () => {
            this.toPay(order, gateway);
          },
        };
      }));
    }

    if (order.canInvoice) {
      actions.push({
        name: 'invoice',
        title: 'crate invoice for all Seller in order',
        color: 'success',
        handler: () => {
          this.toInvoiceOrder(order);
        },
      });
    }

    if (order.canRefund) {
      actions.push({
        name: 'refund',
        title: 'make a refund for all canceled items',
        color: 'danger',
        handler: () => {
          this.toRefundOrder(order);
        },
      });
    }

    return actions;
  }

  createPayment(order: Order, gateway: string, createdAt = new Date()): Payment {
    return this.paymentCollection.add(new Payment(order, gateway, createdAt));
  }

  toPay(order: Order, gateway: string): void {
    const payment = this.createPayment(order, gateway, order.createdAt);
    this.transferPayment(payment);
    order.attachePayment(payment);
  }

  toInvoiceOrderItem(orderItem: OrderItem): OrderItem {
    return orderItem.attacheInvoice(this.currentInvoice(orderItem));
  }

  createRefund(order: Order): Refund {
    const payment = order.refundablePayment;
    // TODO add handle not available payment
    const refund = new Refund(payment);
    // TODO add calculate balances of seller, customer and nodal
    payment.attacheRefund(refund);

    return this.refundCollection.add(refund);
  }

  toRefundOrder(order: Order): void {
    const refund = this.createRefund(order);
    order.refund(refund);
    this.transferRefund(refund);
  }

  toRefundOrderItem(orderItem: OrderItem): void {
    const refund = this.createRefund(this.orderCollection.find(orderItem.orderId));
    orderItem.refund(refund);
    this.transferRefund(refund);
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
    const order = this.currentOrder;
    if (order.save().isSaved) {
      this.createOrder(order.customer);
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
    createdAt: Date = new Date(),
  ): Order {
    const customer = this.customers.find(customerId);
    const item = this.items.find(itemId);
    const seller = this.sellers.find(sellerId);
    const cart = this.currentOrder;
    cart.customer = customer;
    cart.createdAt = createdAt;

    return cart.addItem(
      price,
      item,
      priceShipping,
      qty,
      seller,
    );
  }

  private flowEditNewOrder(): Order {
    const order = this.addOrderItem(
      this.customers.first().id,
      200,
      this.items.first().id,
      50,
      2,
      this.sellers.first().id,
    );

    this.addOrderItem(
      this.customers.first().id,
      200,
      this.items.first().id,
      50,
      2,
      this.sellers.first().id,
    );

    order.createdAt = new Date('1985-10-05T06:00:00');

    return order;
  }

  private flow(): void {
    // 1. Order flow
    let order: Order = null;
    // 1.1. Edit new Order
    this.flowEditNewOrder();
    // 1.2. Save order
    this.saveOrder();
    // 1.3. Pay Order
    this.toPay(this.flowEditNewOrder().save(), this.paymentMethods[0]);
    // 1.4. Create invoice for payed Order by item via Seller
    order = this.flowEditNewOrder().save();
    this.toPay(order, this.paymentMethods[0]);
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
