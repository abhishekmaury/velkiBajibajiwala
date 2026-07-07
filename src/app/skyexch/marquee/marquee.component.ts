import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DatahandlerService } from '../../services/datahandler.service';

@Component({
  selector: 'app-marquee',
  imports:[CommonModule],
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MarqueeComponent implements OnInit{
  usermessage : any;
  constructor( private dataServe : DatahandlerService){}

  ngOnInit(): void {
    let data = {
      "pageNo" : 1,
      "pageSize" : 10
    }
    this.dataServe.getMessageWebsite(data).subscribe((res : any)=>{
      this.usermessage = res.data;
    })
  }
}
