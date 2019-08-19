import order from './order.stub';
import { Payment } from './payment';

export default () => new Payment(order(), 'GW');
