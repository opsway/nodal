import { Account } from '../../aggregate/account';

export class HistoryEvent {
  constructor(
    public action: string,
    public total: number,
    public accounts: Account[],
    public createdAt: Date,
  ) {
  }
}
