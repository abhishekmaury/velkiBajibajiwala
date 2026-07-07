import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-rules-and-reg',
  imports: [],
  templateUrl: './rules-and-reg.component.html',
  styleUrls: ['./rules-and-reg.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RulesAndRegComponent {
  constructor(private location:Location){}
  @Output() closePopup = new EventEmitter()

  closePP(){
    this.closePopup.emit(false)
    this.location.back()
  }
}
