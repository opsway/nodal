import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {Menu} from './menu';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
})
export class MenuComponent implements OnInit {
  @Input() heading: string;
  @Input() list: Menu[];

  constructor(
    public router: Router,
  ) {
  }

  ngOnInit() {
  }
}
