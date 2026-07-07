import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPremiumParlayComponent } from './market-premium-parlay.component';

describe('MarketPremiumParlayComponent', () => {
  let component: MarketPremiumParlayComponent;
  let fixture: ComponentFixture<MarketPremiumParlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketPremiumParlayComponent]
    });
    fixture = TestBed.createComponent(MarketPremiumParlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
