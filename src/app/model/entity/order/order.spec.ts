import { Item } from '../item';
import { Seller } from '../member/seller';
import { OrderItem } from './order-item';
import * as Util from '../../../util/util';
import { Order } from './order';
import { Payment } from '../payment';
import { Invoice } from '../invoice';
import { Refund } from '../refund';
import { Customer } from '../member/customer';

const orderFabric = (numItems, isCustomer = true) => {
  const order = isCustomer ? new Order(new Customer('Aleksei')) : new Order();
  for (let i = 0; i < numItems; i++) {
    order.addItem(
      100,
      new Item(),
      50,
      1,
      new Seller('bar'),
    );
  }
  return order;
};
const paymentFabrica = (order) => {
  return new Payment(
    order,
    'foo',
  );
};
const invoiceFabrica = (order) => {
  return new Invoice(
    order.seller,
    order.itemCollection,
  );
};
const refundFabrica = (order) => {
  return new Refund(
    order.seller,
    order.itemCollection,
  );
};

describe('OrderItem', () => {
  beforeEach(() => {
    Util.sequenceClear();
  });

  it('should create an instance', () => {
    const order = orderFabric(1);
    expect(order).toBeTruthy();
    expect(order.amount).toEqual(10000);
    expect(order.amountShipping).toEqual(5000);
    expect(order.feeMarket).toEqual(826);
    expect(order.total).toEqual(15000);
    expect(order.id).toEqual('O1');
    expect(order.customerName).toEqual('Aleksei');
    expect(order.isEmpty).toEqual(false);
    expect(order.isNew).toEqual(true);
    order.save();
  });

  it('should create an instance', () => {
    const order = orderFabric(0);
    expect(order).toBeTruthy();
    expect(order.amount).toEqual(0);
    expect(order.amountShipping).toEqual(0);
    expect(order.feeMarket).toEqual(0);
    expect(order.total).toEqual(0);
    expect(order.id).toEqual('O1');
    expect(order.customerName).toEqual('Aleksei');
    expect(order.isEmpty).toEqual(true);
    expect(order.isNew).toEqual(true);
    order.save();
  });

  it('test for simple ordering', () => {
    const order = orderFabric(4, false);
    const orderItem1 = order.items[0];
    const orderItem2 = order.items[1];
    const orderItem3 = order.items[2];
    const orderItem4 = order.items[3];

    expect(order.isSaved).toEqual(false);
    order.save();
    expect(orderItem4.status).toEqual('ordered');
    expect(order.isSaved).toEqual(true);

    expect(order.isNoPaid).toEqual(true);
    const payment = paymentFabrica(order);
    order.attachePayment(payment);
    expect(orderItem4.status).toEqual('paid');
    expect(order.isNoPaid).toEqual(false);

    const invoice1 = invoiceFabrica(order);
    orderItem1.attacheInvoice(invoice1);
    expect(orderItem1.status).toEqual('invoiced');

    expect(orderItem2.canCanceled).toEqual(true);
    orderItem2.cancel();
    orderItem3.cancel();
    expect(orderItem2.status).toEqual('canceled');
    expect(orderItem3.status).toEqual('canceled');
    expect(orderItem2.canCanceled).toEqual(false);

    orderItem2.refund(refundFabrica(payment));
    expect(orderItem2.status).toEqual('refunded');

    expect(order.canRefund).toEqual(true);
    order.refund(refundFabrica(payment));
    expect(orderItem3.status).toEqual('refunded');

    invoice1.save();
    invoice1.ship();
    expect(orderItem1.status).toEqual('shipped');

    expect(orderItem1.canReturned).toEqual(true);
    orderItem1.return();
    expect(orderItem1.status).toEqual('returned');
    expect(orderItem1.canReturned).toEqual(false);

    orderItem1.refund(refundFabrica(payment));
    expect(orderItem1.status).toEqual('refunded');

    expect(order.canInvoice).toEqual(true);
    const invoice2 = invoiceFabrica(order);
    orderItem4.attacheInvoice(invoice2);
    expect(orderItem4.status).toEqual('invoiced');
    expect(order.canInvoice).toEqual(false);

    invoice2.save();
    invoice2.cancel();
    expect(orderItem4.status).toEqual('canceled');

    expect(order.canRefund).toEqual(true);
    orderItem4.refund(refundFabrica(payment));
    expect(orderItem4.status).toEqual('refunded');
    expect(order.canRefund).toEqual(false);

    expect(order.total).toEqual(0);
  });

  it('should group items by Invoice', () => {
    const actual = orderFabric(2).groupByInvoiceItems;
    expect(actual.length).toEqual(1);
    expect(actual.shift().items.length).toEqual(2);
  });
});
