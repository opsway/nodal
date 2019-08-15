import { TestBed } from '@angular/core/testing';

import { OrderItemService } from './order-item.service';

describe('OrderItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderItemService = TestBed.get(OrderItemService);
    expect(service).toBeTruthy();
  });
});
