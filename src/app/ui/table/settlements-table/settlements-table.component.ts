import {
  Component,
  Input,
} from '@angular/core';
import { GatewaySettlement } from '../../../model/entity/settlement/gateway-settlement';

@Component({
  selector: 'app-settlements-table',
  templateUrl: 'settlements-table.component.html',
})
export class SettlementsTableComponent {
  @Input() data: GatewaySettlement[];
}
