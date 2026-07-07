import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit{
  balInfo: any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  accountStmt: any;
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
    this.fetchPageData(1)
  }

  fetchPageData(page: number): void {
    this.dataServe.getAccountStmt(page).subscribe((res: any) => {
      this.accountStmt = res?.data.filter((item: any) =>
        item.type === 'Withdraw' || item.type === 'Deposit'
      );
    });
  }
  goBack(): void {
    this.location.back();
  }
}
