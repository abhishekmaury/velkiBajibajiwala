import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParlaySportsComponent } from './parlay-sports.component';

describe('ParlaySportsComponent', () => {
  let component: ParlaySportsComponent;
  let fixture: ComponentFixture<ParlaySportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParlaySportsComponent]
    });
    fixture = TestBed.createComponent(ParlaySportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
