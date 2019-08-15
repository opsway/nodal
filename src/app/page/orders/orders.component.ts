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

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
})
export class OrdersComponent implements OnInit {
  order: Order;
  customer: Customer;
  seller: Seller;
  date: DOMStringList;

  constructor(
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
    console.log(this.date);
    this.order.customer = this.customer;
    this.order.createdAt = new Date();
    console.log(this.order);

    return false;
  }

}
