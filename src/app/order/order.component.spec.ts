import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComponent } from './order.component';
import {OrderService} from './order.service';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderComponent,
      ],
      providers: [
        { provide: OrderService, useValue: new OrderService() },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    pending('FIXME'); // FIXME
    expect(component).toBeTruthy();
  });
});
