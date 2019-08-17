import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ModalDismissReasons,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup, Validators,
} from '@angular/forms';
import {ModelService} from '../../../model/model.service';

@Component({
  selector: 'app-dialog-order-create',
  templateUrl: 'order-create.component.html',
})
export class OrderCreateComponent implements OnInit {
  minDate: string;
  form: FormGroup;
  closeResult: string;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public model: ModelService,
  ) {
  }

  ngOnInit() {
    this.minDate = new Date().toISOString().split('T')[0];
    this.form = this.fb.group({
      orderId: [this.model.currentOrder.id, []],
      customerId: [this.model.customers.first().id, Validators.required],
      date: [this.minDate, Validators.required],
      orderItem: this.fb.group({
        sellerId: [this.model.sellers.first().id, Validators.required],
        itemId: [this.model.items.first().id, Validators.required],
        qty: [1, Validators.required],
        price: [100, [
          Validators.required,
          Validators.min(0.01)
        ]],
        shipping: [20, [
          Validators.required,
          Validators.min(0)
        ]],
      })
    });
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
      const entity = this.model.addOrderItem(
        this.form.value.customerId,
        this.form.value.orderItem.price,
        this.form.value.orderItem.itemId,
        this.form.value.orderItem.shipping,
        this.form.value.orderItem.qty,
        this.form.value.orderItem.sellerId
      );
      entity.order.createdAt = new Date(this.form.value.date);
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
