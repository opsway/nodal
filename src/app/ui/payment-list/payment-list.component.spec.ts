import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListComponent } from './payment-list.component';
import {MatTableModule} from '@angular/material';
import {ConvertPipe} from '../../util/convert.pipe';

describe('PaymentListComponent', () => {
  let component: PaymentListComponent;
  let fixture: ComponentFixture<PaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule
      ],
      declarations: [
        ConvertPipe,
        PaymentListComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
