import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrdersComponent} from './page/orders/orders.component';
import {PaymentsComponent} from './page/payments/payments.component';
import {ShareComponent} from './page/share/share.component';


const routes: Routes = [
  {
    path: '',
    component: OrdersComponent
  },
  {
    path: 'payments',
    component: PaymentsComponent
  },
  {
    path: ':data',
    component: ShareComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
