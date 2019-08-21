import { AccountType } from './account-type.enum';

export class Account {
  constructor(
    public name: string,
    public type: AccountType,
    public balance: number = 0,
  ) {
  }
}
