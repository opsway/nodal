import {
  Injectable,
} from '@angular/core';
import { OrderItem } from './entity/order/order-item';
import { Item } from './entity/item';
import { Order } from './entity/order/order';
import { Collection } from './collection';
import { Invoice } from './entity/invoice';
import { Refund } from './entity/refund';
import { Model } from './model';
import { GatewaySettlement } from './entity/settlement/gateway-settlement';
import { Payment } from './entity/payment';
import { Seller } from './entity/member/seller';
import { Customer } from './entity/member/customer';
import { Transfer } from './entity/transfer';
import { SellerSettlement } from './entity/settlement/seller-settlement';
import { MarketSettlement } from './entity/settlement/market-settlement';
import { VirtualDateService } from '../util/virtual-date.service';
import { History } from './entity/history/history';
import { HistoryEvent } from './entity/history/history-event';
import { Account } from './aggregate/account';
import { AccountType } from './aggregate/account-type.enum';

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
  private static NodalShipping = 'Shipping';
  private static NodalMFFee = 'MF Fee';
  private static NodalMarket = 'Market';
  private customerCollection: Collection<Customer> = new Collection<Customer>();
  private sellerCollection: Collection<Seller> = new Collection<Seller>();
  private orderCollection: Collection<Order> = new Collection<Order>();
  private itemCollection: Collection<Item> = new Collection<Item>();
  private invoiceCollection: Collection<Invoice> = new Collection<Invoice>();
  private refundCollection: Collection<Refund> = new Collection<Refund>();
  private paymentCollection: Collection<Payment> = new Collection<Payment>();
  private settlementCollection: Collection<GatewaySettlement> = new Collection<GatewaySettlement>();
  private sellerSettlementCollection: Collection<SellerSettlement> = new Collection<SellerSettlement>();
  private marketSettlementCollection: Collection<MarketSettlement> = new Collection<MarketSettlement>();
  private transferCollection: Collection<Transfer> = new Collection<Transfer>();
  private accountBalance: Map<string, number> = new Map();
  private eventStream = [];
  readonly history: Collection<History> = new Collection<History>();
  readonly paymentGateways: string[];

  readonly nodalAccounts = [
    ModelService.NodalBank,
    ModelService.NodalShipping,
    ModelService.NodalMFFee,
    ModelService.NodalGWFee,
    ModelService.NodalMarket,
  ];

  constructor(
    private dateService: VirtualDateService,
  ) {
    this.paymentGateways = Model.paymentGateways;
    this.load();
  }

  get accountBalances(): Account[] {
    const sellerAccounts = this.sellers.map(entity => entity.name)
      .map(holder => new Account(holder, AccountType.seller, this.balanceByHolder(holder)));
    const gatewayAccounts = this.paymentGateways
      .map(holder => new Account(holder, AccountType.gateway, this.balanceByHolder(holder)));
    const nodalAccounts = this.nodalAccounts
      .map(holder => new Account(holder, AccountType.nodal, this.balanceByHolder(holder)));

    sellerAccounts.push(new Account(
      'Seller Total',
      AccountType.total,
      sellerAccounts.reduce((acc, entity) => acc + entity.balance, 0),
    ));
    gatewayAccounts.push(new Account(
      'Gateway Total',
      AccountType.total,
      gatewayAccounts.reduce((acc, entity) => acc + entity.balance, 0),
    ));

    return [
      ...gatewayAccounts,
      ...sellerAccounts,
      ...nodalAccounts,
    ];
  }

  private logEvent(date: Date, action: string, total: number): void {
    this.history.add(new History(new HistoryEvent(
      action,
      total,
      this.accountBalances,
      date,
    )));
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

  createTransaction(holder: string, ref: string, amount: number, date: Date = this.dateService.getDate()) {
    if (Math.abs(amount) === 0) {
      return;
    }
    console.log('createTransaction', holder, amount);
    const balance = this.balanceByHolder(holder) + amount;
    this.accountBalance.set(holder, balance);

    return this.transferCollection.add(new Transfer(holder, ref, amount, balance, date));
  }

  transferInvoice(invoice: Invoice): void {
    this.createTransaction(ModelService.NodalShipping, invoice.id, invoice.amountShipping, invoice.createdAt);
    this.createTransaction(ModelService.NodalMFFee, invoice.id, invoice.totalFeeMarket, invoice.createdAt);
    this.createTransaction(invoice.seller.name, invoice.id, invoice.amountSeller, invoice.createdAt);
  }

  transferToSeller(settlement: SellerSettlement): void {
    this.createTransaction(settlement.sellerName, settlement.id, -settlement.amount, settlement.createdAt);
    this.createTransaction(ModelService.NodalBank, settlement.id, -settlement.amount, settlement.createdAt);
  }

  transferToMarket(date: Date): void {
    const invoices = this.invoiceCollection
      .filter(entity => !entity.isMarketCaptured); // TODO add filter by date

    if (invoices.count() > 0) {
      const GWFee = this.balanceByHolder(ModelService.NodalGWFee);
      const settlement = this.marketSettlementCollection.add(new MarketSettlement(
        GWFee,
        date,
      ));
      invoices.walk(entity => settlement.capture(entity));

      this.createTransaction(ModelService.NodalGWFee, settlement.id, -GWFee);
      this.createTransaction(ModelService.NodalMFFee, settlement.id, -settlement.totalFeeMarket, date);
      this.createTransaction(ModelService.NodalShipping, settlement.id, -settlement.amountShipping, date);
      this.createTransaction(ModelService.NodalBank, settlement.id, -settlement.total, date);
      this.createTransaction(ModelService.NodalMarket, settlement.id, settlement.total, date);

      this.logEvent(
        settlement.createdAt,
        `Market settlement: ${settlement.id} (${settlement.references.join(' ')})`,
        settlement.total,
      );
    }
  }

  transferPayment(payment: Payment): void {
    this.createTransaction(payment.gateway, payment.id, payment.total, payment.createdAt);
  }

  transferRefund(refund: Refund): void {
    // GW
    this.createTransaction(refund.gateway, refund.id, -refund.total, refund.createdAt);

    // Market
    const feeMarket = refund.orderItems
      .filter(entity => entity.isInvoiced)
      .reduce((entity, acc) => acc + entity.feeMarket, 0);

    if (feeMarket > 0) {
      this.createTransaction(ModelService.NodalMFFee, refund.id, -feeMarket, refund.createdAt);
    }

    // Shipping
    const shipping = refund.orderItems
      .filter(entity => entity.isInvoiced)
      .reduce((entity, acc) => acc + entity.amountShipping, 0);

    if (shipping > 0) {
      this.createTransaction(ModelService.NodalShipping, refund.id, -shipping, refund.createdAt);
    }

    // Seller
    const sellers = refund.orderItems
      .filter(entity => entity.isInvoiced)
      .reduce((entity, acc) => {
        if (acc.has(entity.sellerName)) {
          acc.set(entity.sellerName, acc.get(entity.sellerName) + entity.amountSeller);
        } else {
          acc.set(entity.sellerName, entity.amountSeller);
        }

        return acc;
      }, new Map());

    sellers.forEach((amount, sellerName) => {
      this.createTransaction(sellerName, refund.id, -amount, refund.createdAt);
    });
    this.logEvent(
      refund.createdAt,
      `Refund: ${refund.id}`,
      refund.total,
    );
  }

  gatewayTransfer(settlement: GatewaySettlement): void {
    this.createTransaction(settlement.gateway, settlement.id, -settlement.amount, settlement.createdAt);
    this.createTransaction(ModelService.NodalBank, settlement.id, settlement.total, settlement.createdAt);
    this.createTransaction(ModelService.NodalGWFee, settlement.id, settlement.fee, settlement.createdAt);
  }

  get paymentMethods(): string[] {
    return this.paymentGateways;
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

  catGatewaySettlement(gateway: string, date: Date): boolean {
    return true; // TODO implement catGatewaySettlement
  }

  doGatewaySettlement(gateway: string, date: Date): void {
    const payments = this.notCapturedPaymentsByGateway(gateway, date);
    const refunds = this.notCapturedRefundsByGateway(gateway, date);
    const amount = payments.reduce((entity, acc) => acc + entity.amount, 0) - refunds.reduce((entity, acc) => acc + entity.total, 0);
    if (payments.count() + refunds.count() > 0 && amount > 0) {
      const settlement = this.settlementCollection.add(new GatewaySettlement(gateway, date))
        .withPayment(payments)
        .withRefund(refunds);
      this.gatewayTransfer(settlement);
      this.logEvent(
        settlement.createdAt,
        `Gateway settlement: ${settlement.id} (${settlement.references.join(' ')})`,
        settlement.total,
      );

    }
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

  get notCapturedRefunds() {
    return this.refunds.filter(entity => !entity.isCaptured);
  }

  notCapturedRefundsByGateway(gateway: string, date: Date = new Date()) {
    return this.notCapturedRefunds
      .filter(entity => entity.gateway === gateway
        && entity.createdAt.getTime() <= date.getTime());
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
    for (const i in data) {
      if (!data.hasOwnProperty(i)) {
        continue;
      }
      const action = data[i].name;
      const date = data[i].date;
      const params = data[i].params;
      let order = null;
      switch (action) {
        case 'createOrder':
          const customer = new Customer('ff');
          customer.deserialize(params.customer);
          this.dateService.getDate();
          // todo date handling
          order = this.createOrder(customer);

          params.items.slice(1).split('|').forEach(itemData => {
            const orderItem = new OrderItem(100,
              new Item(),
              50,
              1,
              new Seller('bar'),
              'O1');
            orderItem.deserialize(JSON.parse(itemData));
            console.log(itemData);
            order.addItem(orderItem.price / 100, orderItem.item, orderItem.priceShipping / 100, orderItem.qty, orderItem.seller);
          });

          order.save();
          break;
        case 'toPay':
          // todo date handling
          order = this.orders.find(params.order_id);
          this.toPay(order, params.gw, date);
          break;
      }
    }

    return true;
  }

  export(): string {
    const content = JSON.stringify(this.eventStream);
    return `${window.location.origin}${window.location.pathname}#/?model=${btoa(content)}`;
  }

  orderActions(order: Order, data: Date): Action[] {
    const actions = [];

    if (order.isNoPaid) {
      actions.push(...this.paymentMethods.map(gateway => {
        return {
          name: gateway,
          title: `pay by ${gateway}`,
          color: 'primary',
          handler: () => {
            this.toPay(order, gateway, data);
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

    if (order.canCanceled) {
      actions.push({
        name: 'cancel',
        title: 'cancel order',
        color: 'info',
        handler: () => {
          order.cancel();
        },
      });
    }

    if (order.canReturned) {
      actions.push({
        name: 'return',
        title: 'create RMA',
        color: 'secondary',
        handler: () => {
          order.return();
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

  createPayment(order: Order, gateway: string, date: Date): Payment {
    return this.paymentCollection.add(new Payment(order, gateway, date));
  }

  toPay(order: Order, gateway: string, data: Date): void {
    this.eventStream.push({
      name: 'toPay', date: this.dateService.getValue(), params: {order_id: order.id, gw: gateway}
    });
    const payment = this.createPayment(order, gateway, data);
    this.transferPayment(payment);
    order.attachePayment(payment);
    this.logEvent(
      order.createdAt,
      `Pay: ${order.id}`,
      order.total,
    );
  }

  toInvoiceOrderItem(orderItem: OrderItem): void {
    const invoice = this.currentInvoice(orderItem);
    orderItem.attacheInvoice(invoice);
  }

  createRefund(order: Order): Refund {
    const payment = order.refundablePayment;
    const refund = new Refund(payment, this.dateService.getDate());
    payment.refund(refund);

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

  canSellerSettlement(name: string): boolean {
    return this.balanceByHolder(name) > 0;
  }

  doSellerSettlement(name: string): void {
    const invoices = this.invoiceCollection
      .filter(entity => entity.seller.name === name && !entity.isCaptured);

    if (invoices.count() > 0) {
      const settlement = this.sellerSettlementCollection.add(new SellerSettlement(name, this.dateService.getDate()));
      invoices.walk(entity => settlement.capture(entity));
      if (settlement.amount !== this.balanceByHolder(name)) {
        return; // TODO add alert
      }
      this.transferToSeller(settlement);
      this.logEvent(
        settlement.createdAt,
        `Seller settlement: ${settlement.id} (${settlement.references.join(' ')})`,
        settlement.total,
      );
    }
  }

  doMarketSettlement(date: Date): void {
    this.transferToMarket(date);
  }

  canMarketSettlement(date: Date): boolean {
    return true;
  }

  saveInvoice(invoice: Invoice): void {
    invoice.save(this.dateService.getDate());
    this.transferInvoice(invoice);
    this.logEvent(
      invoice.createdAt,
      `Invoice: ${invoice.id}`,
      invoice.total,
    );
  }

  toInvoiceOrder(order: Order): Order {
    order.items.forEach(item => {
      this.toInvoiceOrderItem(item);
    });
    this.invoiceCollection
      .filter(invoice => invoice.isDraft)
      .walk(invoice => {
        this.saveInvoice(invoice);
      });

    return order;
  }

  saveOrder(): boolean {
    const order = this.currentOrder;
    if (order.save().isSaved) {
      this.eventStream.push({
        name: 'createOrder', date: this.dateService.getValue(), params: {
          customer: order.customer.serialize(), items: order.items.reduce((current, item) => {
            return current + '|' + JSON.stringify(item.serialize());
          }, '')
        }
      });
      console.log(this.eventStream);
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
    createdAt: Date,
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

  private flowEditNewOrder(
    date: Date,
    items: Array<{ price: number, shipping?: number, qty?: number }>,
    seller: Seller = this.sellers.first(),
  ): Order {
    items.forEach(value => {
      this.addOrderItem(
        this.customers.first().id,
        value.price,
        this.items.first().id,
        value.shipping || 0,
        value.qty || 1,
        seller.id,
        date,
      );
    });

    return this.currentOrder.withDate(date);
  }

  private flowShipOrder(
    date: Date,
    items: Array<{ price: number, shipping?: number, qty?: number }>,
    gateway: string = this.paymentMethods[0],
  ): Order {
    // Edit new Order and Save order
    const order: Order = this.flowEditNewOrder(date, items).save();
    // Pay Order
    this.toPay(order, gateway, date);
    // Create invoice for payed Order by item via Seller
    this.toInvoiceOrder(order);
    // Ship invoice;
    this.invoiceCollection.first().ship(); // FIXME

    return order;
  }

  flowSettlement(
    date: Date,
    seller: Seller = this.sellers.first(),
    gateway: string = this.paymentMethods[0],
  ) {
    this.doSellerSettlement(seller.name);
    this.doGatewaySettlement(gateway, date);
    this.doMarketSettlement(date);
  }

  flow(date: Date): void {
    const gateway = this.paymentMethods[0];
    const seller = this.sellers.first();
    const O1 = this.flowEditNewOrder(
      date,
      [
        {price: 100, shipping: 20},
      ],
    ).save();
    this.toPay(O1, gateway, date);
    this.toInvoiceOrder(O1);
    this.flowSettlement(date, seller, gateway);
  }
}
