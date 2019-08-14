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
} from '@angular/material';
import { OrderComponent } from './ui/order/order.component';
import { CatalogComponent } from './ui/catalog/catalog.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ConvertPipe,
    OrderComponent,
    CatalogComponent
  ],
  imports: [
    MatButtonToggleModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatGridListModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
