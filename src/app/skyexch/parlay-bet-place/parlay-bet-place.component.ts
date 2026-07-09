import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { FingerprintService } from '../../services/fingerprint.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';


@Component({
  selector: 'app-parlay-bet-place',
  templateUrl: './parlay-bet-place.component.html',
  styleUrls: ['./parlay-bet-place.component.css']
})
export class ParlayBetPlaceComponent {
  @Input() data: any
  @Output() closeDt = new EventEmitter()
  @Output() betResult = new EventEmitter()
  @Output() stopTimer = new EventEmitter()
  closeBet = true;
  numPadd = false;
  enableBtn = false;
  showStake: any = 0;
  numPadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '00']
  betsList: any;
  counterBet: any;
  totalOdds = 1;
  totalProfit = 0;
  loading: boolean = false;
  successBet: boolean = false;
  failedBet: boolean = false;
  fingerprintHash = '';
  deviceId: string = '';
  fingerData: any;
  MAX_DIGITS = 7;

  constructor(private router: Router, private dataServe: DataHandlerService, private fingerprintService: FingerprintService) { }

  ngOnInit(): void {
    let btct = localStorage.getItem('parlayOdds')
    if (btct) {
      this.betsList = JSON.parse(btct)
      this.oddsCalculation(this.betsList)
    }
    this.getDeviceId();
    this.getFingerprintHash();
  }

  async getDeviceId(): Promise<void> {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    this.deviceId = result.visitorId;
  }

  async getFingerprintHash() {
    // const comps = await this.fingerprintService.collect();

    // this.dataServe.getIdentify(comps).subscribe((res: any) => {
    //   if (res) {
    //     this.fingerprintHash = res?.uuid;
    //     this.fingerData = res;
    //   }
    // })
  }
  showNumpad() {
    this.numPadd = true;
  }
  hideNumPad() {
    this.numPadd = false;
  }
  cancelBet() {
    this.closeDt.emit('false')
  }

  // addStaticStake(stake: any){
  //   this.showStake += stake
  //   this.enableBtn = true
  //   this.maxProfitCal()
  // }
  // addStaticVal1(num : any, tr:any){
  //   if(this.showStake == 0){
  //     this.showStake = num
  //     this.enableBtn = tr
  //   }else{
  //     this.showStake = `${this.showStake}${num}`
  //   }
  //   this.maxProfitCal()
  // }
  // deleteLastNum(){
  //   this.showStake = +this.showStake.toString().slice(0, -1);
  //   if(this.showStake == 0){
  //     this.enableBtn = false
  //   }
  //   this.maxProfitCal()
  // }
  addStaticStake(stake: number) {
    const nextValue = (this.showStake + stake).toString();

    if (nextValue.length > this.MAX_DIGITS) return;

    this.showStake = +nextValue;
    this.enableBtn = true;
    this.maxProfitCal();
  }
  addStaticVal1(num: any, tr: boolean) {
    const currentValue = this.showStake?.toString() || '';
    const nextValue = currentValue === '0' ? num.toString() : currentValue + num;

    if (nextValue.length > this.MAX_DIGITS) return;

    this.showStake = +nextValue;
    this.enableBtn = tr;
    this.maxProfitCal();
  }

  deleteLastNum() {
    const updatedValue = this.showStake.toString().slice(0, -1);

    this.showStake = updatedValue ? +updatedValue : 0;
    this.enableBtn = this.showStake !== 0;

    this.maxProfitCal();
  }

  removeParlayBet(eventId: any) {
    let localodd = localStorage.getItem('parlayOdds')
    if (localodd) {
      let localodddata = JSON.parse(localodd)
      let localdatalength = localodddata.length
      if (localdatalength == 1) {
        localStorage.removeItem('parlayType')
      }

      let diffEvent = localodddata.filter((item: any) => item.eventId !== eventId);
      if (diffEvent) {
        this.closeDt.emit(diffEvent)
        this.betsList = diffEvent;
        this.oddsCalculation1(this.betsList)
        localStorage.setItem('parlayOdds', JSON.stringify(diffEvent))
      }
    }
  }

  oddsCalculation(betlist: any) {
    let parType = localStorage.getItem('parlayType')
    if (parType == 'Toss') {
      this.totalOdds = 0;
      for (let index = 0; index < betlist.length; index++) {
        const odds = betlist[index].odds;
        this.totalOdds = this.totalOdds + odds
      }
    } else {
      this.totalOdds = 1;
      for (let index = 0; index < betlist.length; index++) {
        const odds = betlist[index].odds;
        this.totalOdds = this.totalOdds * odds
      }
    }
    this.maxProfitCal();
  }

  oddsCalculation1(betlist: any) {
    let parType = localStorage.getItem('parlayType')
    if (parType == 'Toss') {
      this.totalOdds = 0;
      for (let index = 0; index < betlist.length; index++) {
        const odds = betlist[index].odds;
        this.totalOdds = this.totalOdds + odds
      }
    } else {
      this.totalOdds = 1;
      for (let index = 0; index < betlist.length; index++) {
        const odds = betlist[index].odds;
        this.totalOdds = this.totalOdds * odds
      }
    }
    this.maxProfitCal();
  }

  maxProfitCal() {
    let parType = localStorage.getItem('parlayType')
    if (parType == 'Toss') {
      this.totalProfit = (this.totalOdds * this.showStake)
    } else {
      this.totalProfit = (this.totalOdds * this.showStake) - this.showStake
    }
  }

  placeBetFunc() {
    this.loading = true;
    this.stopTimer.emit(this.loading)

    let token = localStorage.getItem('token')
    if (token) {

      // if (this.betsList.length >= 2) {
      //   this.dataServe.placeParlayBets(this.betsList, this.showStake, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
      //   }, (error: any) => {
      //     if (error.status == 200) {
      //       let res1 = this.dataServe.decryptData(error.error.text);
      //       let res = res1.data
      //       if (res.type === 'success') {
      //         this.closeBet = false;
      //         this.successBet = true;
      //         this.cancelBet();

      //         localStorage.removeItem('parlayType')
      //         localStorage.removeItem('parlayOdds')
      //         this.closeDt.emit([])

      //         this.dataServe.betSuccessParlay(this.successBet, this.showStake, res)
      //       } else {
      //         this.closeBet = false;
      //         this.loading = false;
      //         this.successBet = false;
      //         this.cancelBet();
      //         this.dataServe.betSuccessParlay(this.successBet, this.showStake, res)
      //       }
      //     } else {
      //       let res1 = this.dataServe.decryptData(error.error.text);
      //       let res = res1.data
      //       console.log(res);
      //       this.cancelBet();
      //       this.closeBet = false;
      //       this.loading = false;
      //       this.successBet = false;
      //       this.dataServe.betSuccessParlay(this.successBet, this.showStake, res)
      //     }
      //   })
      // } else {
      //   this.closeBet = false;
      //   this.loading = false;
      //   this.successBet = false;
      //   let ddt = { "type": "error", "message": "Please Select min. 2 Parlay for bet placing", "title": "Oops..." }
      //   this.dataServe.betSuccessParlay(this.successBet, this.showStake, ddt)
      // }
    } else {
      this.router.navigate(['/login'])
    }
  }

}
