import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-my-bets',
  standalone: true,
  imports: [CommonModule],
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
  allActiveLiab: any;
  parlayActiveLiability: any;
  selectedList: any;
  ActiveLiablist: any;
  validateapi: any;
  parlayexch = 1;
  isLoading = false;
  count: any;
  parlayActive: any;
  betid = '';
  countEx: any
  constructor(private activeRoute: ActivatedRoute, private dataServe: DataHandlerService, private _location: Location) { }
  ngOnInit(): void {

    if (this.activeRoute.component?.name !== ' MobBtesComponent') {
      this.betsComp = true;
      this.dataServe.getloginFlag(this.betsComp)
    } else {
      this.betsComp = false;
    }

    this.exchangeActiveLiab();
    this.parlayActiveLiab();
  }

  exchangeActiveLiab() {
    let token = localStorage.getItem('token')
    if (token) {
      this.dataServe.getActiveLiabUserWise().subscribe((res: any) => {
        this.allActiveLiab = res;
        this.parlay = this.allActiveLiab.filter((item: any) => item.sportId === 15);
        this.exchange = this.allActiveLiab.filter((item: any) => item.sportId !== 15)
        this.count = this.parlay.length
        this.countEx = this.exchange.length
      })
      this.dataServe.betSuccessMsg.subscribe((res: any) => {
        if (res) {
          this.dataServe.getActiveLiabUserWise().subscribe((res: any) => {
            this.allActiveLiab = res;
            this.parlay = this.allActiveLiab.filter((item: any) => item.sportId === 15);
            this.exchange = this.allActiveLiab.filter((item: any) => item.sportId !== 15)
            this.count = this.parlay.length
            this.countEx = this.exchange.length
          })
        }
      })


      // this.dataServe.getUserUnmatchedBets().subscribe((res: any) => {
      //   this.unmatchedData = res;
      //   this.exchange01 = this.unmatchedData.filter((item: any) => item.sportId !== 15)
      //   this.count = this.parlay.length
      //   this.countEx = this.exchange.length
      // })
    }
  }

  openListInfo(data: any) {
    if (this.betListInfo == false) {
      this.betid = data?.id
      this.selectedList = data
      this.betList = false;
      this.betListInfo = true;
      this.dataServe.getActiveBetsUserWise(this.selectedList.sourceId).subscribe((res: any) => {
        this.ActiveLiablist = res;
      })
    } else {
      this.betListInfo = false
    }
  }

  parlayActiveLiab() {
    let sectime = this.dataServe.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

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

  getParlayById(data: any) {
    if (this.openParlayBets == data) {
      this.openParlayBets = '';
    } else {
      this.openParlayBets = data;
      this.dataServe.getParlayById(data).subscribe((res: any) => {
        this.parlayActive = res
      })

    }
  }
  openListUnmatchedInfo(data: any) {
    if (this.betListInfo == false) {
      this.betid = data?.id
      this.selectedList = data
      this.betList = false;
      this.betListInfo = true;
      this.dataServe.getUnmatchedBetsUserWise(this.selectedList.sourceId).subscribe((res: any) => {
        this.ActiveLiablist = res;
      })
    } else {
      this.betListInfo = false
    }
  }
  goBack() {
    this.betList = true;
    this.betListInfo = false;
    this.betDetails = true;
  }

  showExchangeParlay(data: any) {
    this.parlayexch = data;
  }
  closeMybets() {
    this.closeEmiter.emit(false)
  }

  tabs(data: any) {
    this.activeTab = data;
  }
  closebet() {
    this.betListInfo = false;
    this.betDetails = true;
  }

  close() {
    this.closeModal.emit();
  }
}
