import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleRegulationComponent } from './rule-regulation.component';

describe('RuleRegulationComponent', () => {
  let component: RuleRegulationComponent;
  let fixture: ComponentFixture<RuleRegulationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleRegulationComponent]
    });
    fixture = TestBed.createComponent(RuleRegulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
