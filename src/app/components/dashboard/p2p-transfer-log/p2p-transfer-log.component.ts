import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-p2p-transfer-log',
  templateUrl: './p2p-transfer-log.component.html',
  styleUrls: ['./p2p-transfer-log.component.css']
})

export class P2pTransferLogComponent implements OnInit{
  balInfo: any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  loading=true;
  data:any=[];
  isClassicTheme=false;

  constructor(private dataServe : DataHandlerService,private location: Location) { }

  ngOnInit(): void {
    this.dataServe.changeTheme$.subscribe({
      next:(f) => this.isClassicTheme = f,
    })
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

    this.getUserP2PLogs();
  }

   getUserP2PLogs() {
    this.loading = true;
    this.dataServe.getUserP2PLogs(1).subscribe((res: any) => {
      this.data=res?.data;
      this.loading = false;
    });
  }

  goBack(): void {
    this.location.back();
  }
}
