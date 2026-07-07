import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeSettingsComponent } from './stake-settings.component';

describe('StakeSettingsComponent', () => {
  let component: StakeSettingsComponent;
  let fixture: ComponentFixture<StakeSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StakeSettingsComponent]
    });
    fixture = TestBed.createComponent(StakeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
