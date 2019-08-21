import * as Util from '../../../util/util';
import { OrderItem } from './order-item';
import { Customer } from '../member/customer';
import { Payment } from '../payment';
import { Collection } from '../../collection';
import { Refund } from '../refund';
import { Item } from '../item';
import { Seller } from '../member/seller';
import { InvoiceItems } from '../../aggregate/invoice-items';
import {
  Serialize,
  SerializeProperty,
  Serializable,
} from '@delete21/ts-serializer';

@Serialize({})
export class Order extends Serializable {
  @SerializeProperty({})
  public id: string;
  @SerializeProperty({})
  public createdAt: Date;
  @SerializeProperty({
    type: Customer
  })
  customer: Customer;
  private itemCollection: Collection<OrderItem>;
  private paymentCollection: Collection<Payment> = new Collection<Payment>();

  constructor(customer: Customer = null) {
    super();
    this.id = Util.uuid('O');
    this.createdAt = new Date();
    this.customer = customer;
    this.itemCollection = new Collection<OrderItem>();
  }

  // PROPERTIES

  get hasRefundablePayment(): boolean {
    return this.refundablePayment !== null;
  }

  get refundablePayment(): Payment | null {
    return this.refundablePayments.first();
  }

  get refundablePayments(): Collection<Payment> {
    return this.paymentCollection.filter(entity => entity.isRefundable);
  }

  get customerName(): string {
    return this.customer.name;
  }

  get items(): OrderItem[] {
    return this.itemCollection.all();
  }

  get amountPayable(): number {
    return this.notPaidItems.reduce((entity, amount) => amount + entity.total, 0);
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

  private get canRefundedItems(): Collection<OrderItem> {
    return this.itemCollection.filter(entity => entity.canRefunded);
  }

  private get canCanceledItems(): Collection<OrderItem> {
    return this.itemCollection.filter(entity => entity.canCanceled);
  }

  private get canReturnedItems(): Collection<OrderItem> {
    return this.itemCollection.filter(entity => entity.canReturned);
  }

  get newItems(): Collection<OrderItem> {
    return this.itemCollection.filter(entity => entity.isNew);
  }

  // STATUS
  get canInvoice(): boolean {
    return !this.isNoPaid && this.notInvoicedItems.count() > 0;
  }

  get canRefund(): boolean {
    return this.hasRefundablePayment && this.canRefundedItems.count() > 0;
  }

  get canCanceled(): boolean {
    return this.hasRefundablePayment && this.canCanceledItems.count() > 0;
  }

  get canReturned(): boolean {
    return this.hasRefundablePayment && this.canReturnedItems.count() > 0;
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

  addItem(
    price: number,
    item: Item,
    priceShipping: number,
    qty: number,
    seller: Seller,
  ): Order {
    this.itemCollection.add(new OrderItem(
      price,
      item,
      priceShipping,
      qty,
      seller,
      this.id,
    ));

    return this;
  }

  refund(refund: Refund): Order {
    this.canRefundedItems
      .walk(entity => entity.refund(refund));
    return this;
  }

  cancel(): Order {
    this.canCanceledItems
      .walk(entity => entity.cancel());

    return this;
  }

  return(): Order {
    this.canReturnedItems
      .walk(entity => entity.return());

    return this;
  }

  get groupByInvoiceItems(): InvoiceItems[] {
    return Array.from(this.itemCollection.reduce((entity, acc) => {
      const id = entity.invoice ? entity.invoice.id : '';

      if (acc.has(id)) {
        acc.get(id).items.push(entity);
      } else {
        acc.set(id, new InvoiceItems(entity.invoice, [entity]));
      }

      return acc;
    }, new Map<string, InvoiceItems>()).values())
      .filter((value => value.items.length > 0));
  }

  withDate(date: Date): this {
    this.createdAt = date;

    return this;
  }
}
