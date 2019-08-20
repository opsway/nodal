import {Component, OnInit} from '@angular/core';
import { Menu } from './ui/menu/menu';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { ModelService } from './model/model.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    'app.component.scss',
  ]
})
export class AppComponent implements OnInit {
  title = 'Nodal Acc';
  menu: Menu[] = [
    {
      title: 'Orders',
      path: '/',
    },
    {
      title: 'Payments',
      path: '/payments',
    },
    /*
    {
      title: 'Sellers',
      path: '/sellers',
    },
*/
    {
      title: 'Nodal',
      path: '/nodal',
    },
    /*
    {
      title: 'Refunds',
      path: '/refunds',
    },
    {
      title: 'Customers',
      path: '/customers',
    }, */
    {
      title: 'Share',
      path: '/share',
    },

  ];

  constructor(
    private model: ModelService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
        const modelData  = queryParams.get('model');
        this.model.import(modelData);
    });
  }

}
