import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './ui/layout/layout.component';
import {MenuComponent} from './ui/menu/menu.component';
import {OrdersComponent} from './page/orders/orders.component';
import {PaymentsComponent} from './page/payments/payments.component';
import {ShareComponent} from './page/share/share.component';
import {ConvertPipe} from './util/convert.pipe';
import { OrderItemTableComponent } from './ui/table/ordet-item-table/order-item-table.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MenuComponent,
    OrdersComponent,
    PaymentsComponent,
    ShareComponent,
    ConvertPipe,
    OrderItemTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
