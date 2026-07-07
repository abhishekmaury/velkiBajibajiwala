import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetPlaceParlayComponent } from './bet-place-parlay.component';

describe('BetPlaceParlayComponent', () => {
  let component: BetPlaceParlayComponent;
  let fixture: ComponentFixture<BetPlaceParlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BetPlaceParlayComponent]
    });
    fixture = TestBed.createComponent(BetPlaceParlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
