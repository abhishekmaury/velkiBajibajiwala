import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPagesComponent } from './footer-pages.component';

describe('FooterPagesComponent', () => {
  let component: FooterPagesComponent;
  let fixture: ComponentFixture<FooterPagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterPagesComponent]
    });
    fixture = TestBed.createComponent(FooterPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
