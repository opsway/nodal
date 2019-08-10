import { TestBed } from '@angular/core/testing';

import { PaymentService } from './payment.service';
import {Order} from './order';
import {OrderItem} from './order-item';
import {Item} from './item';
import {Merchant} from './merchant';

describe('PaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentService = TestBed.get(PaymentService);
    expect(service).toBeTruthy();
  });

  it('total', () => {
    const service: PaymentService = TestBed.get(PaymentService);
    service.checkout(new Order([
      new OrderItem(
        new Item(
          100,
        ),
        new Merchant('bar'),
      ),
    ]));
    let actual = service.total();
    expect(actual.amount).toEqual(10000);
    expect(actual.feeMarket).toEqual(700);
    expect(actual.feeGateway).toEqual(0);
    service.gatewaySettlement();
    actual = service.total();
    expect(actual.amount).toEqual(0);
    expect(actual.feeMarket).toEqual(0);
    expect(actual.feeGateway).toEqual(0);
    actual = service.totalCaptured();
    expect(actual.amount).toEqual(10000);
    expect(actual.feeMarket).toEqual(700);
    expect(actual.feeGateway).toEqual(210);
  });
});
