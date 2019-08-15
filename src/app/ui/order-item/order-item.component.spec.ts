import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemComponent } from './order-item.component';
import {MatTableModule} from '@angular/material';
import {ConvertPipe} from '../../util/convert.pipe';

describe('OrderItemComponent', () => {
  let component: OrderItemComponent;
  let fixture: ComponentFixture<OrderItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule
      ],
      declarations: [
        ConvertPipe,
        OrderItemComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
