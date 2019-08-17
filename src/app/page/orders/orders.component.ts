import {
  Component,
  OnInit,
} from '@angular/core';
import {SellerService} from '../../model/member/seller/seller.service';
import {CustomerService} from '../../model/member/customer/customer.service';
import {Order} from '../../model/order/order';
import {OrderService} from '../../model/order/order.service';
import {ModelService} from '../../model/model.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../model/item/item.service';
import {TableProvider} from '../../ui/table/table-provider';
import {OrderItem} from '../../model/order-item/order-item';
import {ConvertPipe} from '../../util/convert.pipe';

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
      customerId: [this.customerService.first().id, Validators.required],
      date: [this.minDate, Validators.required],
      orderItem: this.fb.group({
        sellerId: [this.sellerService.first().id, Validators.required],
        itemId: [this.itemService.first().id, Validators.required],
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

  get orders(): TableProvider<Order> {
    return new TableProvider<Order>(
      this.model.orders,
      [
        TableProvider.cellDef('id'),
        TableProvider.cellDef('customerName')
          .withHeader('Customer'),
      ],
    );
  }

  get itemsOrder(): TableProvider<OrderItem> {
    return this.createItemsOrderProvider(this.order.items);
  }

  createItemsOrderProvider(data: OrderItem[]): TableProvider<OrderItem> {
    return new TableProvider<OrderItem>(
      data,
      [
        TableProvider.cellDef('sellerName')
          .withHeader('Seller'),
        TableProvider.cellDef('sku')
          .withHeader('SKU'),
        TableProvider.cellDef('price')
          .withFooter('')
          .withPipe(new ConvertPipe()),
        TableProvider.cellDef('qty')
          .withFooter('Total'),
        TableProvider.cellDef('amountShipping')
          .withHeader('total shipping')
          .withPipe(new ConvertPipe())
          .withFooter(this.order.amountShipping),
        TableProvider.cellDef('total')
          .withHeader('total price')
          .withPipe(new ConvertPipe())
          .withFooter(this.order.total),
        TableProvider.cellDef('feeMarket')
          .withHeader('total fee')
          .withPipe(new ConvertPipe())
          .withFooter(this.order.feeMarket),
      ],
    );
  }

  saveOrder(): void {
    this.order = this.model.saveOrder();
    this.form.patchValue({
      orderId: this.order.id,
    });
  }

  addOrderItem(): boolean {
    if (this.form.valid) {
      const entity = this.model.addOrderItem(
        this.form.value.customerId,
        this.form.value.orderItem.price,
        this.form.value.orderItem.itemId,
        this.form.value.orderItem.shipping,
        this.form.value.orderItem.qty,
        this.form.value.orderItem.sellerId
      );
      entity.order.createdAt = this.form.value.date;
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
