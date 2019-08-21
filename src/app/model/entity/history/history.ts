import * as Util from '../../../util/util';
import { Entity } from '../entity';
import { HistoryEvent } from './history-event';

export class History implements Entity {
  id: string;

  constructor(
    private event: HistoryEvent,
  ) {
    this.id = Util.uuid('H');
  }

  get createdAt() {
    return this.event.createdAt;
  }

  get action() {
    return this.event.action;
  }

  get total() {
    return this.event.total;
  }

  get accountBalances() {
    return this.event.accounts;
  }
}
