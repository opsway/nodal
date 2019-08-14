import { Component, OnInit } from '@angular/core';
import {ItemService} from '../../model/item/item.service';
import {OrderService} from '../../model/order/order.service';
import {CustomerService} from '../../model/member/customer.service';
import {MerchantService} from '../../model/member/merchant.service';
import {Customer} from '../../model/member/customer';
import {Order} from '../../model/order/order';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AddToCartDialogComponent } from '../add-to-cart-dialog/add-to-cart-dialog.component';

@Component({
  selector: 'app-catalog',
  templateUrl: 'catalog.component.html',
  styleUrls: ['catalog.component.css']
})
export class CatalogComponent implements OnInit {
  currentCustomer: Customer;
  item: ItemService;
  order: OrderService;
  customer: CustomerService;
  merchant: MerchantService;

  constructor(
    item: ItemService,
    order: OrderService,
    customer: CustomerService,
    merchant: MerchantService,
    public dialog: MatDialog
  ) {
    this.item = item;
    this.order = order;
    this.customer = customer;
    this.merchant = merchant;
    this.currentCustomer = this.customer.first();
  }

  ngOnInit() {
  }

  addToCart(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '450px';

    const dialogRef = this.dialog.open(AddToCartDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.table(result);
      const item = this.item.create(result.price);
      this.order.addToCart(
        result.customer,
        result.seller,
        item
      );
      this.currentCustomer = result.customer;
    });
  }

  checkout(): void {
    this.order.checkout(this.currentCustomer);
  }

  get cart(): Order {
    return this.order.currentCart(this.currentCustomer);
  }
}
