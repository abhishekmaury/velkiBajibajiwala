import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {
  private popupSubject = new Subject<boolean>();
  private popupBet = new Subject<boolean>();
  private openEditProfile = new Subject<boolean>();
  private openRegion = new Subject<boolean>();
  private openSearch = new Subject<boolean>();
  private alertPopup = new Subject<boolean>();
  alertState$ = this.alertPopup.asObservable();
  popupState$ = this.popupSubject.asObservable();
  popupBetstate$ = this.popupBet.asObservable();
  openEditState$ = this.openEditProfile.asObservable();
  openRegionState$ = this.openRegion.asObservable();
  openSearchState$ = this.openSearch.asObservable();

  openPopup() {
    this.popupSubject.next(true);
  }

  closePopup() {
    this.popupSubject.next(false);
  }
  openBetPopup() {
    this.popupBet.next(true);
  }

  closeBetPopup() {
    this.popupBet.next(false);
  }
  openEditProfi() {
    this.openEditProfile.next(true);
  }
  openReg() {
    this.openRegion.next(true);
  }
  search(data: any) {
    this.openSearch.next(data);
  }
  openalert(data: any) {
    this.alertPopup.next(data);

  }
  closeProfile(){
    this.openEditProfile.next(false)
  }
  closereg(){
    this.openRegion.next(false)
  }
  closeSearch(){
    this.openSearch.next(false)
  }
  closeAlert(){
    this.alertPopup.next(false)
  }
}
