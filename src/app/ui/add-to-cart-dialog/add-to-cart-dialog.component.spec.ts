import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderPopupComponent } from './create-order-popup.component';

describe('CreateOrderPopupComponent', () => {
  let component: CreateOrderPopupComponent;
  let fixture: ComponentFixture<CreateOrderPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrderPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
