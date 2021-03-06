import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { MenuComponent } from './ui/menu/menu.component';
import { OrdersComponent } from './page/orders/orders.component';
import { PaymentsComponent } from './page/payments/payments.component';
import { ShareComponent } from './page/share/share.component';
import { AutoFocusDirective } from './util/auto-focus/auto-focus.directive';
import { ConvertPipe } from './util/convert.pipe';
import { PureTableComponent } from './ui/table/pure-table/pure-table.component';
import { SellersComponent } from './page/sellers/sellers.component';
import { NodalComponent } from './page/nodal/nodal.component';
import { OrderCreateComponent } from './ui/dialog/order-create/order-create.component';
import { OrderItemsTableComponent } from './ui/table/order-items-table/order-items-table.component';
import { HistoryComponent } from './page/history/history.component';
import { CustomersComponent } from './page/customers/customers.component';
import { PaymentsTableComponent } from './ui/table/payments-table/payments-table.component';
import { DateFormatPipe } from './util/date-format.pipe';
import { RefundsTableComponent } from './ui/table/refunds-table/refunds-table.component';
import { SettlementsTableComponent } from './ui/table/settlements-table/settlements-table.component';
import { AccountBalancesTableComponent } from './ui/table/account-balances-table/account-balances-table.component';
import { CreateSettlementComponent } from './ui/dialog/create-settlement/create-settlement.component';
import { TimeAndDateComponent } from './ui/menu/time-and-date/time-and-date.component';
import { OrderModule } from 'ngx-order-pipe';
import { ItemStatusActionsComponent } from './ui/table/item-status-actions/item-status-actions.component';
import { InvoiceActionsComponent } from './ui/table/invoice-actions/invoice-actions.component';
import { ToastsComponent } from './ui/toasts/toasts.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MenuComponent,
    OrdersComponent,
    PaymentsComponent,
    ShareComponent,
    ConvertPipe,
    PureTableComponent,
    SellersComponent,
    NodalComponent,
    OrderCreateComponent,
    OrderItemsTableComponent,
    AutoFocusDirective,
    HistoryComponent,
    CustomersComponent,
    PaymentsTableComponent,
    DateFormatPipe,
    RefundsTableComponent,
    SettlementsTableComponent,
    AccountBalancesTableComponent,
    CreateSettlementComponent,
    TimeAndDateComponent,
    ItemStatusActionsComponent,
    InvoiceActionsComponent,
    ToastsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    OrderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
