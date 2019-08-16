import {
  Component,
  OnInit,
} from '@angular/core';
import {Customer} from '../../model/member/customer/customer';
import {Seller} from '../../model/member/seller/seller';
import {SellerService} from '../../model/member/seller/seller.service';
import {CustomerService} from '../../model/member/customer/customer.service';
import {Order} from '../../model/order/order';
import {OrderService} from '../../model/order/order.service';
import {ModelService} from '../../model/model.service';
import {Item} from '../../model/item/item';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
})
export class OrdersComponent implements OnInit {
  order: Order;
  customer: Customer;
  item: Item;
  price: number;
  priceShipping: number;
  qty: number;
  seller: Seller;
  date: Date;

  constructor(
    public model: ModelService,
    public sellerService: SellerService,
    public customerService: CustomerService,
    public orderService: OrderService,
  ) {
    this.order = this.orderService.currentCart();
    this.customer = this.customerService.first();
    this.seller = this.sellerService.first();
  }

  ngOnInit() {
  }

  addToCart(): boolean {
    const entity = this.model.addToCart(
      this.customer,
      this.price,
      this.item,
      this.priceShipping,
      this.qty,
      this.seller,
    );
    entity.order.createdAt = this.date;
    console.log(entity);

    return false;
  }

}
