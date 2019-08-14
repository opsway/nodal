import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import * as Util from '../../util/util';

let service: ItemService;

describe('ItemService', () => {
  beforeEach(() => {
    Util.sequenceClear();
    TestBed.configureTestingModule({});
    service = new ItemService();
  });

  it('should be created', () => {
    service = TestBed.get(ItemService);
    expect(service).toBeTruthy();
  });

  it('should be find', () => {
    expect(service.find('notExist')).toBeNull();
    expect(service.find('SKU1')).not.toBeNull();
  });

  it('should be has items', () => {
    expect(service.all().length).toEqual(4);
    expect(service.count()).toEqual(4);
  });

  it('should be has items', () => {
    expect(service.create(100).id).toEqual('SKU5');
  });
});
