import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogComponent } from './catalog.component';
import {ItemService} from '../../model/item/item.service';
import {OrderService} from '../../model/order/order.service';
import {CustomerService} from '../../model/member/customer.service';
import {MerchantService} from '../../model/member/merchant.service';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CatalogComponent
      ],
      providers: [
        { provide: ItemService, useValue: new ItemService() },
        { provide: OrderService, useValue: new OrderService() },
        { provide: CustomerService, useValue: new CustomerService() },
        { provide: MerchantService, useValue: new MerchantService() },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    pending('FIXME'); // FIXME
    expect(component).toBeTruthy();
  });
});
