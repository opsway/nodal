import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Customer } from '../../model/member/customer/customer';
import { Seller } from '../../model/member/seller/seller';
import { Item } from '../../model/item/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../model/member/customer/customer.service';
import { SellerService } from '../../model/member/seller/seller.service';

@Component({
  selector: 'app-create-order-dialog',
  templateUrl: './add-to-cart-dialog.component.html',
})
export class AddToCartDialogComponent implements OnInit {
  submitted = false;
  customerList: Array<Customer>;
  sellerList: Array<Seller>;
  form: FormGroup;

  constructor(
    private customerService: CustomerService,
    private sellerService: SellerService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddToCartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      customer: Customer,
      seller: Seller,
      item: Item
    }) {
  }

  ngOnInit(): void {
    this.customerList = this.customerService.all();
    this.sellerList = this.sellerService.all();

    this.form = this.fb.group({
      customer: [this.customerService.first(), Validators.required],
      seller: [this.sellerService.first(), Validators.required],
      price: [0, [
        Validators.required,
        Validators.min(0),
      ]],
      shipping: [0, [
        Validators.required,
        Validators.min(0),
      ]],
      sku: ['',
        Validators.required
      ],
      qty: [1,
        Validators.required
      ],
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.submitted = true;
      for (const inner in this.form.controls) {
        if (this.form.controls.hasOwnProperty(inner)) {
          this.form.get(inner).markAsTouched();
          this.form.get(inner).updateValueAndValidity();
        }
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  hasError = (controlName: string, errorName: string) => this.form.controls[controlName].hasError(errorName);
}
