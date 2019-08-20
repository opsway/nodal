import {Injectable} from '@angular/core';
import {Shared} from './shared';
import {OrderItem} from './entity/order/order-item';
import {Item} from './entity/item';
import {Order} from './entity/order/order';
import {Collection} from './collection';
import {Invoice} from './entity/invoice';
import {Refund} from './entity/refund';
import {Model} from './model';
import {Settlement} from './entity/settlement';
import {Payment} from './entity/payment';
import {Seller} from './entity/member/seller';
import {Customer} from './entity/member/customer';
import {Transfer} from './entity/transfer';
import {SellerSettlement} from './entity/seller-settlement';
import {MarketSettlement} from './entity/market-settlement';
import {VirtualDateService} from '../util/virtual-date.service';
import {trimTrailingNulls} from '@angular/compiler/src/render3/view/util';

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
  private customerCollection: Collection<Customer> = new Collection<Customer>();
  private sellerCollection: Collection<Seller> = new Collection<Seller>();
  private orderCollection: Collection<Order> = new Collection<Order>();
  private itemCollection: Collection<Item> = new Collection<Item>();
  private invoiceCollection: Collection<Invoice> = new Collection<Invoice>();
  private refundCollection: Collection<Refund> = new Collection<Refund>();
  private paymentCollection: Collection<Payment> = new Collection<Payment>();
  private settlementCollection: Collection<Settlement> = new Collection<Settlement>();
  private sellerSettlementCollection: Collection<SellerSettlement> = new Collection<SellerSettlement>();
  private marketSettlementCollection: Collection<MarketSettlement> = new Collection<MarketSettlement>();
  private transferCollection: Collection<Transfer> = new Collection<Transfer>();
  private accountBalance: Map<string, number> = new Map();
  private eventStream = [];
  readonly paymentGateways: string[];

  constructor(
    private dateService: VirtualDateService,
  ) {
    this.paymentGateways = Model.paymentGateways;
    this.load();
    // if (meta.releaseNumber === 'local') {
    //  this.flow();
    // }
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

  transferToMarket(): void {
    const invoices = this.invoiceCollection
      .filter(entity => !entity.isMarketCaptured);

    if (invoices.count() > 0) {
      const GWFee = this.balanceByHolder(ModelService.NodalGWFee);
      const settlement = this.marketSettlementCollection.add(new MarketSettlement(GWFee));
      invoices.walk(entity => settlement.capture(entity));

      this.createTransaction(ModelService.NodalGWFee, settlement.id, -GWFee);
      this.createTransaction(ModelService.NodalMFFee, settlement.id, -settlement.totalFeeMarket);
      this.createTransaction(ModelService.NodalShipping, settlement.id, -settlement.amountShipping);
      this.createTransaction(ModelService.NodalBank, settlement.id, -settlement.total);
    }
  }

  transferPayment(payment: Payment): void {
    this.createTransaction(payment.gateway, payment.id, payment.total, payment.createdAt);
  }

  transferRefund(refund: Refund): void {
    // GW
    this.createTransaction(refund.gateway, refund.id, -refund.total, refund.createdAt);

    // Market
    const feeMarket = refund.orderItem
      .filter(entity => entity.isInvoiced)
      .reduce((entity, acc) => acc + entity.feeMarket, 0);

    if (feeMarket > 0) {
      this.createTransaction(ModelService.NodalMFFee, refund.id, -feeMarket, refund.createdAt);
    }

    // Shipping
    const shipping = refund.orderItem
      .filter(entity => entity.isInvoiced)
      .reduce((entity, acc) => acc + entity.amountShipping, 0);

    if (shipping > 0) {
      this.createTransaction(ModelService.NodalShipping, refund.id, -shipping, refund.createdAt);
    }

    // Seller
    const sellers = refund.orderItem
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
  }

  transferSettlement(settlement: Settlement): void {
    this.createTransaction(settlement.gateway, settlement.id, -settlement.total, settlement.createdAt);
    this.createTransaction(ModelService.NodalBank, settlement.id, settlement.total, settlement.createdAt);
    this.createTransaction(ModelService.NodalGWFee, settlement.id, settlement.fee, settlement.createdAt);
  }

  get paymentMethods(): string[] {
    return this.paymentGateways;
  }

  get nodalAccounts(): string[] {
    return [
      ModelService.NodalBank,
      ModelService.NodalGWFee,
      ModelService.NodalShipping,
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
    // TODO dateMin / dateMax;
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
    for (const i in data) {
      if (!data.hasOwnProperty(i)) {
        continue;
      }
      const action = data[i].name;
      const date = data[i].date;
      const params = data[i].params;
      switch (action) {
        case 'createOrder':
          const customer = new Customer('ff');
          customer.deserialize(params.customer);
          this.dateService.getDate();
          // todo date handling
          const order = this.createOrder(customer);

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

      }
    }

    return true;
  }

  export(): string {
    const content = JSON.stringify(this.eventStream);
    return `${window.location.origin}/#/?model=${btoa(content)}`;
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
    const payment = this.createPayment(order, gateway, this.dateService.getDate());
    this.transferPayment(payment);
    order.attachePayment(payment);
  }

  toInvoiceOrderItem(orderItem: OrderItem): void {
    const invoice = this.currentInvoice(orderItem);
    orderItem.attacheInvoice(invoice);
  }

  createRefund(order: Order): Refund {
    const payment = order.refundablePayment;
    // TODO add handle not available payment
    const refund = new Refund(payment, this.dateService.getDate());
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

  catMakeSettlementToSeller(name: string): boolean {
    return this.balanceByHolder(name) > 0;
  }

  makeSettlementToSeller(name: string): void {
    const invoices = this.invoiceCollection
      .filter(entity => entity.seller.name === name && !entity.isCaptured);

    if (invoices.count() > 0) {

      const settlement = this.sellerSettlementCollection.add(new SellerSettlement(name, this.dateService.getDate()));
      invoices.walk(entity => settlement.capture(entity));
      if (settlement.amount !== this.balanceByHolder(name)) {
        console.log('makeSettlementToSeller:', settlement.amount, this.balanceByHolder(name));
        return; // TODO add alert
      }
      this.transferToSeller(settlement);
    }
  }

  makeSettlementToMarket(): void {
    this.transferToMarket();
  }

  canMakeSettlementToMarket(): boolean {
    return true;
  }

  saveInvoice(invoice: Invoice): void {
    invoice.save(this.dateService.getDate());
    this.transferInvoice(invoice);
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
      100,
      this.items.first().id,
      20,
      1,
      this.sellers.first().id,
    );

    /*    this.addOrderItem(
          this.customers.first().id,
          100,
          this.items.first().id,
          20,
          1,
          this.sellers.first().id,
        );*/

    order.createdAt = new Date();

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
