import { TestBed } from '@angular/core/testing';

import { PaymentService } from './payment.service';
import {TransferService} from '../transaction/transfer.service';
import {Order} from '../order/order';
import {Item} from '../item/item';
import {Seller} from '../member/seller/seller';
import {Customer} from '../member/customer/customer';
import * as Util from '../../util/util';
import {OrderItem} from '../order-item/order-item';

describe('PaymentService', () => {
  beforeEach(() => {
    Util.sequenceClear();
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service: PaymentService = TestBed.get(PaymentService);
    expect(service).toBeTruthy();
  });

  it('total', () => {
    const service: PaymentService = new PaymentService(new TransferService());
    const order = new Order(new Customer('bob'));
    const entity = new OrderItem(
      100,
      new Item(),
      50,
      1,
      new Seller('bar'),
    );
    service.toPay(order, 'foo');
    let actual = service.total();
    expect(actual.amount).toEqual(10000);
    expect(actual.feeMarket).toEqual(826);
    expect(actual.feeGateway).toEqual(0);
    service.gatewaySettlement();
    actual = service.total();
    expect(actual.amount).toEqual(0);
    expect(actual.feeMarket).toEqual(0);
    expect(actual.feeGateway).toEqual(0);
    actual = service.totalCaptured();
    expect(actual.amount).toEqual(10000);
    expect(actual.feeMarket).toEqual(826);
    expect(actual.feeGateway).toEqual(210);
  });
});
