import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTossParlayComponent } from './market-toss-parlay.component';

describe('MarketTossParlayComponent', () => {
  let component: MarketTossParlayComponent;
  let fixture: ComponentFixture<MarketTossParlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketTossParlayComponent]
    });
    fixture = TestBed.createComponent(MarketTossParlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
