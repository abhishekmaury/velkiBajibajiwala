import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetPlaceComponent } from './bet-place.component';

describe('BetPlaceComponent', () => {
  let component: BetPlaceComponent;
  let fixture: ComponentFixture<BetPlaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BetPlaceComponent]
    });
    fixture = TestBed.createComponent(BetPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
