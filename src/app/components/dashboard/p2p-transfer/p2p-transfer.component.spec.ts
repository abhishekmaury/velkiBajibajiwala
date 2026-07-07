import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pTransferComponent } from './p2p-transfer.component';

describe('P2pTransferComponent', () => {
  let component: P2pTransferComponent;
  let fixture: ComponentFixture<P2pTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [P2pTransferComponent]
    });
    fixture = TestBed.createComponent(P2pTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
