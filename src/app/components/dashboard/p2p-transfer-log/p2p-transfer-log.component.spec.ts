import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pTransferLogComponent } from './p2p-transfer-log.component';

describe('P2pTransferLogComponent', () => {
  let component: P2pTransferLogComponent;
  let fixture: ComponentFixture<P2pTransferLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [P2pTransferLogComponent]
    });
    fixture = TestBed.createComponent(P2pTransferLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
