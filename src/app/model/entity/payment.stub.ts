import order from './order/order.stub';
import { Payment } from './payment';

export default () => new Payment(order(), 'GW', new Date());
