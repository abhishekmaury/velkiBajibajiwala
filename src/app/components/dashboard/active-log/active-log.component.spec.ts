import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveLogComponent } from './active-log.component';

describe('ActiveLogComponent', () => {
  let component: ActiveLogComponent;
  let fixture: ComponentFixture<ActiveLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveLogComponent]
    });
    fixture = TestBed.createComponent(ActiveLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
