import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransferLogComponent } from './payment-transfer-log.component';

describe('PaymentTransferLogComponent', () => {
  let component: PaymentTransferLogComponent;
  let fixture: ComponentFixture<PaymentTransferLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentTransferLogComponent]
    });
    fixture = TestBed.createComponent(PaymentTransferLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
