import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-responsible-gaming',
  imports: [],
  templateUrl: './responsible-gaming.component.html',
  styleUrls: ['./responsible-gaming.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResponsibleGamingComponent {
  constructor(private location:Location){}
  @Output() closePopup = new EventEmitter()

  closePP(){
    this.closePopup.emit(false)
    this.location.back()
  }
}
