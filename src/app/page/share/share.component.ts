import {
  Component,
  OnInit,
} from '@angular/core';
import {ModelService} from '../../model/model.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: 'share.component.html',
})
export class ShareComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public model: ModelService,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const data = params.get('data');
      console.log('ShareComponent:', data);
      if (data === 'share') {
        this.model.share();
      } else {
        this.model.import(data);
      }
    });
  }
}
