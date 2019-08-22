import {Component, TemplateRef} from '@angular/core';
import { ToastsService } from './toasts.service';

@Component({
  selector: 'app-toasts',
  styleUrls: ['toasts.component.scss'],
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hide)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  host: {'[class.ngb-toasts]': 'true'}
})
export class ToastsComponent {
  constructor(public toastService: ToastsService) {}

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}
