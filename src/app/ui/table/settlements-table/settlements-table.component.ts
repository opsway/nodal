import {
  Component,
  Input,
} from '@angular/core';
import { GatewaySettlement } from '../../../model/entity/settlement/gateway-settlement';
import { ORDER_BY_PARAMS } from '../../../util/constant';

@Component({
  selector: 'app-settlements-table',
  templateUrl: 'settlements-table.component.html',
})
export class SettlementsTableComponent {
  @Input() data: GatewaySettlement[];

  orderType = ORDER_BY_PARAMS.type;
  orderReverse = ORDER_BY_PARAMS.reverse;
}
