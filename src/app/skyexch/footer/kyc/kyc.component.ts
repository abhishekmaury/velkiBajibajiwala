import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-kyc',
  imports: [],
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class KycComponent {
  constructor(private location:Location){}
  @Output() closePopup = new EventEmitter()

  closePP(){
    this.closePopup.emit(false)
    this.location.back()
  }
}
