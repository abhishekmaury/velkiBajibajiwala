import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrivacyPolicyComponent {
  constructor(private location: Location){}

  @Output() closePopup = new EventEmitter()

  closePP() {
    this.closePopup.emit(false);
    this.location.back()
  }
}
