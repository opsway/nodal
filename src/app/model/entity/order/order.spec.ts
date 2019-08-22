import { Item } from '../item';
import { Seller } from '../member/seller';
import { OrderItem } from './order-item';
import * as Util from '../../../util/util';
import { Order } from './order';
import { Payment } from '../payment';
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

const paymentFabric = (order: Order) => {
  return new Payment(
    order,
    'foo',
    order.createdAt,
  );
};

const refundFabric = (payment: Payment) => {
  return new Refund(
    payment,
    payment.createdAt,
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
    expect(order.id).toEqual('O_1');
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
    expect(order.id).toEqual('O_1');
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
    const payment = paymentFabric(order);
    order.attachePayment(payment);
    expect(orderItem4.status).toEqual('paid');
    expect(order.isNoPaid).toEqual(false);


    expect(orderItem2.canCanceled).toEqual(true);
    orderItem2.cancel();
    orderItem3.cancel();
    expect(orderItem2.status).toEqual('canceled');
    expect(orderItem3.status).toEqual('canceled');
    expect(orderItem2.canCanceled).toEqual(false);

    orderItem2.refund(refundFabric(payment));
    expect(orderItem2.status).toEqual('refunded');

    expect(order.canRefund).toEqual(true);
    order.refund(refundFabric(payment));
    expect(orderItem3.status).toEqual('refunded');

    orderItem4.refund(refundFabric(payment));
    expect(orderItem4.status).toEqual('refunded');
    expect(order.canRefund).toEqual(false);

    expect(order.total).toEqual(15000);
  });

  it('should group items by Invoice', () => {
    const actual = orderFabric(2).groupByInvoiceItems;
    expect(actual.length).toEqual(1);
    expect(actual.shift().items.length).toEqual(2);
  });
});
