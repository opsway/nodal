import {
  Component,
  OnInit,
} from '@angular/core';
import {
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder, FormControl,
  FormGroup, Validators
} from '@angular/forms';
import { ModelService } from '../../../model/model.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialog-order-create',
  templateUrl: 'order-create.component.html',
  providers: [
    DatePipe,
  ]
})
export class OrderCreateComponent implements OnInit {
  minDate: string;
  form: FormGroup;
  closeResult: string;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public model: ModelService,
    private datePipe: DatePipe,
  ) {
    this.minDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
  }

  ngOnInit() {

    this.form = this.fb.group({
      orderId: [this.model.currentOrder.id, []],
      customerId: [this.model.customers.first().id, Validators.required],
      date: [this.minDate, [
        Validators.required,
        this.validateDate
      ]],
      orderItem: this.fb.group({
        sellerId: [this.model.sellers.first().id, Validators.required],
        itemId: [this.model.items.first().id, Validators.required],
        qty: [1, [
          Validators.required,
          Validators.min(1),
        ]],
        price: [100, [
          Validators.required,
          Validators.min(0.01),
        ]],
        shipping: [20, [
          Validators.required,
          Validators.min(0),
        ]],
      })
    }, {validator: this.checkDate()});
  }

  checkDate() {
    return (group: FormGroup): {[key: string]: any} => {
      const d = group.controls.date;
      const min = new Date(this.minDate);
      const test = new Date(d.value);
      return (min > test) ? {
        checkDate: `Date should be greater than ${this.datePipe.transform(this.minDate, 'yyyy-MM-dd HH:gsmm')}`
      } : {};
    };
  }
  validateDate = (c: FormControl) => {
    const min = new Date(this.minDate);
    const test = new Date(c.value);
    return (min > test) ? {
      checkDate: {
        valid: false
      }
    } : null;
  }

  open(content) {
    this.modalService.open(content, {
      centered: true,
      size: 'xl',
    }).result.then(() => {
      this.closeResult = this.saveOrder() ? 'order is saved' : 'save order error';
    }, () => {
      this.closeResult = 'order is draft';
    });
  }

  saveOrder(): boolean {
    this.form.patchValue({
      orderId: this.model.currentOrder.id,
    });

    return this.model.saveOrder();
  }

  addOrderItem(): boolean {
    if (this.form.valid) {
      this.model.addOrderItem(
        this.form.value.customerId,
        this.form.value.orderItem.price,
        this.form.value.orderItem.itemId,
        this.form.value.orderItem.shipping,
        this.form.value.orderItem.qty,
        this.form.value.orderItem.sellerId,
        new Date(this.form.value.date),
      );
    } else {
      for (const inner in this.form.controls) {
        if (this.form.controls.hasOwnProperty(inner)) {
          this.form.get(inner).markAsTouched();
          this.form.get(inner).updateValueAndValidity();
        }
      }
    }

    return false;
  }
}
