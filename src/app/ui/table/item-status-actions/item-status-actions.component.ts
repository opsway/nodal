import { Component, Input, OnInit } from '@angular/core';
import { ModelService } from '../../../model/model.service';

@Component({
  selector: 'app-item-status-actions',
  templateUrl: './item-status-actions.component.html',
})
export class ItemStatusActionsComponent implements OnInit {
  @Input() item;

  constructor(
    public model: ModelService,
  ) {
  }

  ngOnInit() {
  }

}
