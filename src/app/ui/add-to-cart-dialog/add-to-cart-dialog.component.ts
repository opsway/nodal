import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Customer } from '../../model/member/customer';
import { Merchant } from '../../model/member/merchant';
import { Item } from '../../model/item/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../model/member/customer.service';
import { MerchantService } from '../../model/member/merchant.service';

@Component({
  selector: 'app-create-order-dialog',
  templateUrl: './add-to-cart-dialog.component.html',
})
export class AddToCartDialogComponent implements OnInit {
  submitted = false;
  customerList: Array<Customer>;
  sellerList: Array<Merchant>;
  form: FormGroup;

  constructor(
    private customerService: CustomerService,
    private sellerService: MerchantService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddToCartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      customer: Customer,
      seller: Merchant,
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
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.submitted = true;
    }
  }

  close() {
    this.dialogRef.close();
  }

}
