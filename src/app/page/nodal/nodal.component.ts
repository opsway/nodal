import {
  Component,
} from '@angular/core';
import { ModelService } from '../../model/model.service';

@Component({
  selector: 'app-nodal',
  templateUrl: 'nodal.component.html',
})
export class NodalComponent {
  constructor(
    public model: ModelService,
  ) {
  }
}
