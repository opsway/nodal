import { Injectable } from '@angular/core';
import { Transfer } from './transfer';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private collection: Map<string, Transfer>;

  constructor() {
    this.collection = new Map();
  }

  send(amount: number, to: string): void {
    const transfer = new Transfer(amount, to);
    this.collection.set(transfer.id, transfer);
  }

  all(): Transfer[] {
    return Array.from(this.collection.values()).reverse();
  }
}
