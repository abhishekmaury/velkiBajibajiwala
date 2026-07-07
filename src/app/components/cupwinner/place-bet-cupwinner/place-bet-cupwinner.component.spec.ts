import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceBetCupwinnerComponent } from './place-bet-cupwinner.component';

describe('PlaceBetCupwinnerComponent', () => {
  let component: PlaceBetCupwinnerComponent;
  let fixture: ComponentFixture<PlaceBetCupwinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceBetCupwinnerComponent]
    });
    fixture = TestBed.createComponent(PlaceBetCupwinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
