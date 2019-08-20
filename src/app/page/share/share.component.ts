import {
  Component,
  OnInit,
} from '@angular/core';
import { ModelService } from '../../model/model.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: 'share.component.html',
})
export class ShareComponent implements OnInit {
  private link: string;

  constructor(
    private route: ActivatedRoute,
    public model: ModelService,
  ) {
  }

  ngOnInit() {
    this.link = this.model.export();
  }
}
