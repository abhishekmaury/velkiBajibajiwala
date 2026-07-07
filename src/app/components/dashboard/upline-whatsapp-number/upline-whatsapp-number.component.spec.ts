import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UplineWhatsappNumberComponent } from './upline-whatsapp-number.component';

describe('UplineWhatsappNumberComponent', () => {
  let component: UplineWhatsappNumberComponent;
  let fixture: ComponentFixture<UplineWhatsappNumberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UplineWhatsappNumberComponent]
    });
    fixture = TestBed.createComponent(UplineWhatsappNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
