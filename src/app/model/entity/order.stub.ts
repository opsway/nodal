import customer from './member/customer.stub';
import { Order } from '../order/order';

export default () => new Order(customer());
