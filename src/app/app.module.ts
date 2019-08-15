import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConvertPipe } from './util/convert.pipe';

import {
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatTableModule,
  MatButtonToggleModule,
  MatGridListModule,
  MatSelectModule,
  MatInputModule,
  MatDialogModule
} from '@angular/material';
import { OrderComponent } from './ui/order/order.component';
import { CatalogComponent } from './ui/catalog/catalog.component';
import { OrderItemComponent } from './ui/order-item/order-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddToCartDialogComponent } from './ui/add-to-cart-dialog/add-to-cart-dialog.component';
import { PaymentListComponent } from './ui/payment-list/payment-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ConvertPipe,
    OrderComponent,
    CatalogComponent,
    OrderItemComponent,
    CatalogComponent,
    AddToCartDialogComponent,
    PaymentListComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonToggleModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatGridListModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [AddToCartDialogComponent]
})
export class AppModule { }
