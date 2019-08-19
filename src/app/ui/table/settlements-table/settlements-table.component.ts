import {
  Component,
  Input,
} from '@angular/core';
import { Settlement } from '../../../model/entity/settlement';

@Component({
  selector: 'app-settlements-table',
  templateUrl: 'settlements-table.component.html',
})
export class SettlementsTableComponent {
  @Input() data: Settlement[];
}
