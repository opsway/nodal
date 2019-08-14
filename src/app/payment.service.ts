import {Injectable} from '@angular/core';
import {Payment} from './payment';
import {Order} from './order/order';
import {Total} from './total';
import {NodalBalance} from './nodal-balance';
import {TransferService} from './transfer.service';
import {Transfer} from './transfer';
import {Merchant} from './member/merchant';
import {OrderItem} from './order/order-item';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private collection: Map<string, Payment>;
  nodalBalance: NodalBalance;

  constructor(
    private transfer: TransferService,
  ) {
    this.collection = new Map();
    this.nodalBalance = new NodalBalance();
  }

  get transfers(): Transfer[] {
    return this.transfer.all();
  }

  find(id: string): Payment | null {
    return this.collection.get(id);
  }

  refund(item: OrderItem): void {
    const refund = item.refund();
    this.nodalBalance.merchant -= refund;
    this.nodalBalance.total -= refund;
  }

  checkout(order: Order): void {
    const payment = new Payment(order);
    this.collection.set(payment.id, payment);
  }

  noCaptured(): Array<Payment> {
    return this.all().filter((payment: Payment) => payment.status !== 'captured');
  }

  captured(): Array<Payment> {
    return this.all().filter((payment: Payment) => payment.status === 'captured');
  }

  totalCaptured(): Total {
    return this.captured().reduce((total: Total, payment: Payment) => total.increment(payment), new Total());
  }

  total(): Total {
    return this.noCaptured().reduce((total: Total, payment: Payment) => total.increment(payment), new Total());
  }

  nodalSettlement(): void {
    this.nodalBalance.merchants.forEach((merchant: Merchant) => {
      if (merchant.balance > 0) {
        this.transfer.send(merchant.balance, merchant.name);
        merchant.balance = 0;
      }
    });
    this.nodalBalance.merchant = 0;
    this.transfer.send(this.nodalBalance.market, 'MARKET');
    this.nodalBalance.market = 0;
    this.nodalBalance.total = 0;
  }

  gatewaySettlement(): void {
    const nodalTotalPrev = this.nodalBalance.total;
    this.noCaptured().forEach((payment: Payment) => {
      payment.capture();
      this.nodalBalance.increment(payment);
    });
    this.transfer.send(this.nodalBalance.total - nodalTotalPrev, 'NA');
  }

  all(): Payment[] {
    return Array.from(this.collection.values()).reverse();
  }
}
