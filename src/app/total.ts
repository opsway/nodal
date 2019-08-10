import {Payment} from './payment';

export class Total {
  amount = 0;
  feeMarket = 0;
  feeGateway = 0;

  constructor() {
  }

  get market(): number {
    return this.feeMarket - this.feeGateway;
  }

  get merchant(): number {
    return this.amount - this.market;
  }

  increment(payment: Payment): Total {
    this.amount += payment.amount;
    this.feeMarket += payment.feeMarket;
    this.feeGateway += payment.feeGateway || 0;

    return this;
  }
}
