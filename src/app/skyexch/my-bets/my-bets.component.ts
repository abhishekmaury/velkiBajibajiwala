import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-my-bets',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.css']
})
export class MyBetsComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() closeEmiter = new EventEmitter()
  @Input() data: any;
  myBetDetails: any;
  betDetails = true;
  exchange: any;
  parlay: any;
  activeTab = 'exchange'
  parlayLiabData: any;
  openParlayBets: any;

  betsComp = false;
  betList = true;
  betListInfo = false;
  allActiveLiab : any;
  parlayActiveLiability : any;
  selectedList : any;
  ActiveLiablist : any;
  validateapi : any;
  parlayexch = 1;
  isLoading = false;
  constructor(private activeRoute: ActivatedRoute, private dataServe : DataHandlerService,private _location: Location) { }
  ngOnInit(): void {

    if(this.activeRoute.component?.name !== ' MobBtesComponent'){
      this.betsComp = true;
      this.dataServe.getloginFlag(this.betsComp)
    }else{
      this.betsComp = false;
    }

    this.exchangeActiveLiab();
    this.parlayActiveLiab();
  }

  exchangeActiveLiab(){
    this.isLoading = true;
    let walletId = localStorage.getItem("walletId");
    let sectime = this.dataServe.getTimeStamp();
    let data = {"timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey, "walletId": walletId }

    //  this.dataServe.verifyUser(data).subscribe((res: any) => {
    //  }, (error) => {
    //    if (error.status == 200) {
    //      this.validateapi = this.dataServe.decryptData(error.error.text);
    //      if (this.validateapi.data.type == 'success') {
    //        this.dataServe.getActiveLiabUserWise1(data).subscribe((res: any) => {
    //        }, (error) => {
    //          if (error.status == 200) {
    //            let msd = this.dataServe.decryptData(error.error.text);
    //            this.exchange = msd.data;
    //            this.isLoading = false;
    //          }
    //        })
    //      }
    //    }
    //  })
  }

  openListInfo(data : any){
    this.selectedList = data
    this.betDetails = false;

    this.betList = false;
    this.betListInfo = true;
    this.isLoading = true;

    let sectime = this.dataServe.getTimeStamp();
    let data1 = {"timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    // this.dataServe.verifyUser(data1).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataServe.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataServe.getActiveBetsUserWise1(this.selectedList.eventid,data1).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let msd = this.dataServe.decryptData(error.error.text);
    //           this.ActiveLiablist = msd.data;
    //           this.isLoading = false;
    //         }
    //       })
    //     }
    //   }
    // })
  }

  parlayActiveLiab(){
    let sectime = this.dataServe.getTimeStamp();
    let data = {"timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    //  this.dataServe.verifyUser(data).subscribe((res: any) => {
    //  }, (error) => {
    //    if (error.status == 200) {
    //      this.validateapi = this.dataServe.decryptData(error.error.text);
    //      if (this.validateapi.data.type == 'success') {
    //        this.dataServe.getActiveParlayLiabUserWise(data).subscribe((res: any) => {
    //        }, (error) => {
    //          if (error.status == 200) {
    //            let msd = this.dataServe.decryptData(error.error.text);
    //           this.parlayActiveLiability = msd.data;
    //          }
    //        })
    //      }
    //    }
    //  })
  }

  getParlayById(data : any){
    if(this.openParlayBets==data){
      this.openParlayBets = '';
    } else {
      this.isLoading = true;
      this.openParlayBets = data;
      this.parlayLiabData = [];
      let sectime = this.dataServe.getTimeStamp();
      let data1 = {"timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

      // this.dataServe.verifyUser(data1).subscribe((res: any) => {
      // }, (error) => {
      //   if (error.status == 200) {
      //     this.validateapi = this.dataServe.decryptData(error.error.text);
      //     if (this.validateapi.data.type == 'success') {
      //       this.dataServe.getParlayById(data,data1).subscribe((res: any) => {
      //       }, (error) => {
      //         if (error.status == 200) {
      //           let msd = this.dataServe.decryptData(error.error.text);
      //           this.parlayLiabData = msd.data;
      //           this.isLoading = false;
      //         }
      //       })
      //     }
      //   }
      // })
    }
  }

  goBack(){
    this.betList = true;
    this.betListInfo = false;
    this.betDetails = true;
  }

  showExchangeParlay(data:any){
    this.parlayexch=data;
  }
  closeMybets() {
    this.closeEmiter.emit(false)
  }

  tabs(data: any) {
    this.activeTab = data;
  }
  closebet(){
    this.betListInfo=false;
    this.betDetails = true;
  }

  close() {
    this.closeModal.emit();
  }
}
