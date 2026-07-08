import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-tandc',
  standalone: true,
  imports: [],
  templateUrl: './tandc.component.html',
  styleUrls: ['./tandc.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TandcComponent implements OnInit{
constructor(private location:Location){}
  @Output() closePopup = new EventEmitter()
  domainName : any;
  ngOnInit(): void {
    let webdata = localStorage.getItem("webData");
    if(webdata){
      let formatedDt = JSON.parse(webdata)
      this.domainName = formatedDt?.domain;
    }
  }
  closePP(){
    this.closePopup.emit(false)
    this.location.back()
  }
}
