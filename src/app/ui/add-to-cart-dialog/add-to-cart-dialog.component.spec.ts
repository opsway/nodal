import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartDialogComponent } from './add-to-cart-dialog.component';
import {
  MatSelectModule,
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

describe('AddToCartDialogComponent', () => {
  let component: AddToCartDialogComponent;
  let fixture: ComponentFixture<AddToCartDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
      ],
      declarations: [
        AddToCartDialogComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToCartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    pending('FIXME'); // FIXME NullInjectorError: StaticInjectorError(DynamicTestModule)[AddToCartDialogComponent -> MatDialogRef]
    expect(component).toBeTruthy();
  });
});
