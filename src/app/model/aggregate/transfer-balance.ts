import { Transfer } from '../entity/transfer';

export class TransferBalance {
  constructor(
    public transfer: Transfer,
    private balanceCurrent: number,
  ) {
  }

  get id() {
    return this.transfer.id;
  }

  get holder() {
    return this.transfer.holder;
  }

  get ref() {
    return this.transfer.ref;
  }

  get amount() {
    return this.transfer.amount;
  }

  get createdAt() {
    return this.transfer.createdAt;
  }

  get balance() {
    return this.balanceCurrent;
  }
}
