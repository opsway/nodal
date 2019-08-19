import customer from '../member/customer.stub';
import { Order } from './order';

export default () => new Order(customer());
