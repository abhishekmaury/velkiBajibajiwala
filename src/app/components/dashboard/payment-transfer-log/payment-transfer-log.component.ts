import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-transfer-log',
  templateUrl: './payment-transfer-log.component.html',
  styleUrls: ['./payment-transfer-log.component.css'],
  standalone:true,
  imports:[RouterLink],
})
export class PaymentTransferLogComponent implements OnInit{
  balInfo: any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  constructor(private dataServe : DataHandlerService,private location: Location) { }

  ngOnInit(): void {
    this.dataServe.getBalInfo().subscribe((res : any)=>{
      this.balInfo = res;
    })

    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing=this.jsonWeblinksdt?.validShowing;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
