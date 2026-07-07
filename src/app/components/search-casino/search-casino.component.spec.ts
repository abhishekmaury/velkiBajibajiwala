import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCasinoComponent } from './search-casino.component';

describe('SearchCasinoComponent', () => {
  let component: SearchCasinoComponent;
  let fixture: ComponentFixture<SearchCasinoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchCasinoComponent]
    });
    fixture = TestBed.createComponent(SearchCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
