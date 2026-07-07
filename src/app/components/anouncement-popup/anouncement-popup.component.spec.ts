import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnouncementPopupComponent } from './anouncement-popup.component';

describe('AnouncementPopupComponent', () => {
  let component: AnouncementPopupComponent;
  let fixture: ComponentFixture<AnouncementPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnouncementPopupComponent]
    });
    fixture = TestBed.createComponent(AnouncementPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
