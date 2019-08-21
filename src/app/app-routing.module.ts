import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
} from '@angular/router';
import { OrdersComponent } from './page/orders/orders.component';
import { PaymentsComponent } from './page/payments/payments.component';
import { ShareComponent } from './page/share/share.component';
import { NodalComponent } from './page/nodal/nodal.component';
import { SellersComponent } from './page/sellers/sellers.component';
import { HistoryComponent } from './page/history/history.component';
import { CustomersComponent } from './page/customers/customers.component';


const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
  },
  {
    path: 'payments',
    component: PaymentsComponent,
  },
  {
    path: 'sellers',
    component: SellersComponent,
  },
  {
    path: 'nodal',
    component: NodalComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  },
  {
    path: 'customers',
    component: CustomersComponent,
  },
  {
    path: ':data',
    component: ShareComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
