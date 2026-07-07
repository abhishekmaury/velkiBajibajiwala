import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CupwinnerComponent } from './cupwinner.component';

describe('CupwinnerComponent', () => {
  let component: CupwinnerComponent;
  let fixture: ComponentFixture<CupwinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CupwinnerComponent]
    });
    fixture = TestBed.createComponent(CupwinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
