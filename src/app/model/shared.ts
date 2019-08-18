import { Customer } from './member/customer/customer';
import { Seller } from './member/seller/seller';

export interface Shared {
  customers: Customer[];
  sellers: Seller[];
}
