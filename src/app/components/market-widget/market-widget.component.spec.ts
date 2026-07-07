import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketWidgetComponent } from './market-widget.component';

describe('MarketWidgetComponent', () => {
  let component: MarketWidgetComponent;
  let fixture: ComponentFixture<MarketWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketWidgetComponent]
    });
    fixture = TestBed.createComponent(MarketWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
