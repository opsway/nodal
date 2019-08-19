import { Customer } from './entity/member/customer';
import { Seller } from './entity/member/seller';

export interface Shared {
  customers: Customer[];
  sellers: Seller[];
}
