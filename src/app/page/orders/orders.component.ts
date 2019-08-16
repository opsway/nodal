import {
  Component,
  OnInit,
} from '@angular/core';
import {SellerService} from '../../model/member/seller/seller.service';
import {CustomerService} from '../../model/member/customer/customer.service';
import {Order} from '../../model/order/order';
import {OrderService} from '../../model/order/order.service';
import {ModelService} from '../../model/model.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../model/item/item.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
})
export class OrdersComponent implements OnInit {
  order: Order;
  minDate: string;
  form: FormGroup;

  constructor(
    public model: ModelService,
    public sellerService: SellerService,
    public customerService: CustomerService,
    public orderService: OrderService,
    private itemService: ItemService,
    private fb: FormBuilder,
  ) {
    this.order = this.orderService.currentCart();
  }

  ngOnInit() {
    this.minDate = new Date().toISOString().split('T')[0];
    this.form = this.fb.group({
      orderId: [this.order.id, []],
      customer: [this.customerService.first(), Validators.required],
      date: [this.minDate, Validators.required],
      item: this.fb.group({
        seller: [this.sellerService.first(), Validators.required],
        sku: [this.itemService.first(), Validators.required],
        qty: [1, Validators.required],
        price: [100, [
          Validators.required,
          Validators.min(0.01)
        ]],
        shipping: [20, [
          Validators.required,
          Validators.min(0)
        ]],
      })
    });
  }

  checkout(): void {
    this.order = this.model.checkout();
  }

  addToCart(): boolean {
    if (this.form.valid) {
      const entity = this.model.addToCart(
        this.form.value.customer,
        this.form.value.item.price,
        this.form.value.item.sku, // TODO item
        this.form.value.item.shipping,
        this.form.value.item.qty,
        this.form.value.item.seller
      );
      entity.order.createdAt = this.form.value.date;
      console.log(entity);
    } else {
      for (const inner in this.form.controls) {
        if (this.form.controls.hasOwnProperty(inner)) {
          this.form.get(inner).markAsTouched();
          this.form.get(inner).updateValueAndValidity();
        }
      }
    }

    return false;
  }
}
