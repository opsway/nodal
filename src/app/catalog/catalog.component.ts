import { Component, OnInit } from '@angular/core';
import {ItemService} from './item.service';
import {Item} from './item';
import {OrderService} from '../order/order.service';
import {CustomerService} from '../member/customer.service';
import {Merchant} from '../member/merchant';
import {MerchantService} from '../member/merchant.service';
import {Customer} from '../member/customer';
import {Order} from '../order/order';

@Component({
  selector: 'app-catalog',
  templateUrl: 'catalog.component.html',
  styleUrls: ['catalog.component.css']
})
export class CatalogComponent implements OnInit {
  current: {
    customer: Customer;
    merchant: Merchant;
  };
  item: ItemService;
  order: OrderService;
  customer: CustomerService;
  merchant: MerchantService;

  displayedColumns: string[] = [
    'id',
    'price',
    'action',
  ];

  constructor(
    item: ItemService,
    order: OrderService,
    customer: CustomerService,
    merchant: MerchantService,
  ) {
    this.item = item;
    this.order = order;
    this.customer = customer;
    this.merchant = merchant;

    this.current = {
      customer: this.customer.first(),
      merchant: this.merchant.first(),
    };
  }

  ngOnInit() {
  }

  addToCart(item: Item): void {
    this.order.addToCart(
      this.current.customer,
      this.current.merchant,
      item,
    );
  }

  checkout(): void {
    this.order.checkout(this.current.customer);
  }

  get cart(): Order {
    return this.order.currentCart(this.current.customer);
  }
}
