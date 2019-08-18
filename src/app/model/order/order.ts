import * as Util from '../../util/util';
import { OrderItem } from '../order-item/order-item';
import { Customer } from '../member/customer/customer';
import { Payment } from '../payment/payment';
import { Collection } from '../collection';
import { Invoice } from '../entity/invoice';

export class Order {
  id: string;
  createdAt: Date;
  customer: Customer;
  private itemCollection: Collection<OrderItem>;
  private paymentCollection: Collection<Payment> = new Collection<Payment>();

  constructor(customer: Customer = null) {
    this.id = Util.uuid('O');
    this.createdAt = new Date();
    this.customer = customer;
    this.itemCollection = new Collection<OrderItem>();
  }

  // PROPERTIES

  get hasPaymentAvailable(): boolean {
    return this.paymentAvailable !== null;
  }

  get paymentAvailable(): Payment | null {
    return this.notRefundedPayments.first();
  }

  get notRefundedPayments(): Collection<Payment> {
    return this.paymentCollection.filter(entity => entity.isNotRefunded);
  }

  get customerName(): string {
    return this.customer.name;
  }

  get items(): OrderItem[] {
    return this.itemCollection.all();
  }

  get amount(): number {
    return this.items.reduce((amount, item) => amount + item.amount, 0);
  }

  get amountShipping(): number {
    return this.items.reduce((amount, item) => amount + item.amountShipping, 0);
  }

  get total(): number {
    return this.items.reduce((amount, item) => amount + item.total, 0);
  }

  get feeMarket(): number {
    return this.items.reduce((amount, item) => amount + item.feeMarket, 0);
  }

  get notPaidItems(): Collection<OrderItem> {
    return this.itemCollection.filter(entity => !entity.isPaid);
  }

  get notInvoicedItems(): Collection<OrderItem> {
    return this.itemCollection.filter(entity => entity.canInvoiced);
  }

  get canRefundedItems(): Collection<OrderItem> {
    return this.itemCollection.filter(entity => entity.canRefunded);
  }

  get newItems(): Collection<OrderItem> {
    return this.itemCollection.filter(entity => entity.isNew);
  }

  // STATUS
  get canInvoice(): boolean {
    return !this.isNoPaid && this.notInvoicedItems.count() > 0;
  }

  get canRefund(): boolean {
    return this.hasPaymentAvailable && this.canRefundedItems.count() > 0;
  }

  get isNoPaid(): boolean {
    return this.notPaidItems.count() > 0;
  }

  get isSaved(): boolean {
    return !this.isNew;
  }

  get isEmpty(): boolean {
    return this.itemCollection.count() === 0;
  }

  get isNew(): boolean {
    return this.isEmpty
      || this.newItems.count() > 0;
  }

  get isUnchanged(): boolean {
    return this.amount <= 0;
  }

  // ACTION

  attachePayment(payment: Payment): Order {
    this.paymentCollection.add(payment);
    // TODO add check item amount and total of payment for partition payment
    this.notPaidItems
      .walk(entity => entity.attachePayment(payment));

    return this;
  }

  save(): Order {
    if (this.isUnchanged) {
      return this;
    }
    this.newItems
      .walk(entity => entity.save());

    return this;
  }

  addItem(entity: OrderItem): OrderItem {
    this.itemCollection.add(entity);

    return entity;
  }
}
