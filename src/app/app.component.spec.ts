import {TestBed, async} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {ConvertPipe} from './convert.pipe';

import {ItemService} from './item.service';
import {PaymentService} from './payment.service';
import {TransferService} from './transfer.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        ConvertPipe,
      ],
      providers: [
        { provide: ItemService, useValue: new ItemService() },
        { provide: PaymentService, useValue: new PaymentService(new TransferService()) },
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title in a h1 tag', () => {
    pending('temporary skip'); // FIXME trouble with setup providers
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('MODELING NODAL');
  });
});
