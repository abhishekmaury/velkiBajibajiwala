import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { FingerprintService } from '../../services/fingerprint.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';


@Component({
  selector: 'app-place-bet-cupwinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-bet-cupwinner.component.html',
  styleUrls: ['./place-bet-cupwinner.component.css']
})
export class PlaceBetCupwinnerComponent {
  @Input() clsClr: any
  @Input() data: any
  @Input() updOddsBack: any
  @Input() updOddsLay: any
  @Input() socketEventData: any
  @Input() isInplay: any;
  @Output() betResult = new EventEmitter()
  @Output() stopTimer = new EventEmitter()
  closeBet = true;
  counterBet: any = 0;
  loginResData: any;
  stakeArr: any;
  loading: boolean = false;
  successBet: boolean = false;
  failedBet: boolean = false;
  profit: any[] = []
  oddminStake: any;
  oddmaxStake: any;
  oddsLimit: any;
  inplay: any;
  selectedodds: any;
  oddsPnlArray: any[] = []
  bmPnlArray: any[] = []
  fancyLiability: any[] = [];
  LocalLimit: any;
  fingerprintHash = '';
  deviceId: string = '';
  fingerData: any;

  stake = { 'stake1': '10', 'stake2': '20', 'stake3': '50', 'stake4': '100', 'stake5': '500', 'stake6': '1000' };
  numPadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '00', '.']
  enableBtn = false

  constructor( private router : Router, private dataServe: DataHandlerService, private fingerprintService: FingerprintService){}

  ngOnInit(): void {
    this.profit.push(this.data)

    let data1 = localStorage.getItem('userStake');
    let data = localStorage.getItem('userData');
    if (data) {
      let locdt = JSON.parse(data)
      this.LocalLimit = locdt.data.user;
    }

    if (data1) {
      this.loginResData = JSON.parse(data1);
      this.stakeArr = this.loginResData.data;
    } else if (data) {
      this.loginResData = JSON.parse(data);
      this.stakeArr = this.loginResData.stake;
    } else {
      this.stakeArr = this.stake;
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

  addStakValue(val: any, tr: any) {
    this.enableBtn = tr
    this.counterBet = val
    this.oddsbetCalculation(this.counterBet)
    return this.counterBet
  }

  cancelBet() {
    this.closeBet = false
    this.counterBet = 0
    this.betResult.emit(this.closeBet)
    return this.counterBet
  }
  minusCounter(tr: any) {
    if (this.counterBet > 5) {
      this.counterBet--
      this.oddsbetCalculation(this.counterBet)
      return this.counterBet
    } else if (this.counterBet) {
      this.counterBet = 5;
      this.oddsbetCalculation(this.counterBet)
      return this.counterBet
    }
  }
  plusCounter(tr: any) {
    this.enableBtn = tr
    if (this.counterBet == undefined) {
      this.counterBet = 10
      this.oddsbetCalculation(this.counterBet)
      return this.counterBet
    }
    this.counterBet++
    this.oddsbetCalculation(this.counterBet)
    return this.counterBet
  }
  addStaticVal1(num: any, tr: any) {
    this.enableBtn = tr
    if (this.counterBet == undefined) {
      this.counterBet = num
      this.oddsbetCalculation(+this.counterBet)
      return this.counterBet
    } else {
      this.counterBet = `${this.counterBet}${num}`
      this.oddsbetCalculation(+this.counterBet)
      return this.counterBet
    }
  }
  deleteLastNum() {
    this.counterBet = +this.counterBet.toString().slice(0, -1);
    this.oddsbetCalculation(this.counterBet)
  }

  oddsbetCalculation(stakes: any) {
    this.data.push(stakes)
    this.betResult.emit(this.data)
    this.data.pop()
  }

  placeBetFunc() {
    this.loading = true;
    this.stopTimer.emit(this.loading)

    let token = localStorage.getItem('token')
    if (token) {

      this.selectedodds = this.data[0].odds;

      if (this.data[0].sourceBetType === '') {

        if (this.socketEventData.status == true) {

          if ((this.socketEventData.markets[0].marketName == 'Match Odds') && (this.socketEventData.markets[0].status == true)) {

            this.oddsLimit = this.socketEventData.markets[0].limit[2].b2CoddsLimit;

            if (this.LocalLimit.currency == 'BDT') {
              if (this.isInplay == true) {
                this.oddminStake = this.socketEventData.markets[0].limit[2].b2CminStake;
                this.oddmaxStake = this.socketEventData.markets[0].limit[2].b2CmaxStake;
              } else {
                this.oddminStake = this.socketEventData.markets[0].limit[2].b2CpreMinStake;
                this.oddmaxStake = this.socketEventData.markets[0].limit[2].b2CpreMaxStake;
              }
            } else {
              if (this.isInplay == true) {
                this.oddminStake = this.socketEventData.markets[0].limit[1].b2CminStake;
                this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CmaxStake;
              } else {
                this.oddminStake = this.socketEventData.markets[0].limit[1].b2CpreMinStake;
                this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CpreMaxStake;
              }
            }

            if ((this.oddminStake <= this.counterBet) && (this.oddmaxStake >= this.counterBet)) {

              if (this.oddsLimit >= this.selectedodds) {
                if (this.data[0].isBack == true) {

                  if ((this.updOddsBack >= this.data[0].odds) && ((this.updOddsBack - this.data[0].odds) <= 0.05)) {

                    // this.dataServe.setCupWinnerOddsBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
                    // }, (error: any) => {
                    //   if (error.status == 200) {
                    //     let res1 = this.dataServe.decryptData(error.error.text);
                    //     let res = res1.data
                    //     if (res.type === 'success') {
                    //       this.closeBet = false;
                    //       this.successBet = true;
                    //       this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                    //     } else {
                    //       this.closeBet = false;
                    //       this.loading = false;
                    //       this.successBet = false;
                    //       this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                    //     }

                    //   } else {
                    //     let res1 = this.dataServe.decryptData(error.error.text);
                    //     let res = res1.data

                    //     this.closeBet = false;
                    //     this.loading = false;
                    //     this.successBet = false;
                    //     this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)

                    //   }
                    // })

                  } else {

                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = { "type": "error", "message": "Odds Changed, Bet can't be placed", "title": "Oops..." };

                    this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)

                  }

                } else {

                  if ((this.updOddsLay <= this.data[0].odds) && (this.data[0].odds - this.updOddsLay) <= 0.05) {

                    // this.dataServe.setCupWinnerOddsBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
                    // }, (error: any) => {
                    //   if (error.status == 200) {
                    //     let res1 = this.dataServe.decryptData(error.error.text);
                    //     let res = res1.data
                    //     if (res.type === 'success') {
                    //       this.closeBet = false;
                    //       this.successBet = true;
                    //       this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                    //     } else {
                    //       this.closeBet = false;
                    //       this.loading = false;
                    //       this.successBet = false;
                    //       this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                    //     }

                    //   } else {
                    //     let res1 = this.dataServe.decryptData(error.error.text);
                    //     let res = res1.data

                    //     this.closeBet = false;
                    //     this.loading = false;
                    //     this.successBet = false;
                    //     this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)

                    //   }
                    // })

                  } else {
                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = { "type": "error", "message": "Odds Changed, Bet can't be placed", "title": "Oops..." };

                    this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                  }
                }
              } else {
                this.closeBet = false;
                this.loading = false;
                this.successBet = false;
                let res = { "type": "error", "message": "Max odds limit is " + this.oddsLimit, "title": "Oops..." };

                this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
              }

            } else {
              this.closeBet = false;
              this.loading = false;
              this.successBet = false;
              let res = { "type": "error", "message": "Stake limit is between " + this.oddminStake + " to " + this.oddmaxStake, "title": "Oops..." };

              this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
            }

          } else {
            this.closeBet = false;
            this.loading = false;
            this.successBet = false;
            let res = { "type": "error", "message": "Market ID is Inactive", "title": "Oops..." };

            this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
          }

        } else {
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          let res = { "type": "error", "message": "Match is Inactive", "title": "Oops..." };

          this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
        }
      }
    } else {
      this.router.navigate(['/login'])
    }
  }
  numberOnly(event: any): any {
    this.counterBet = event?.target?.value;
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var regex2 = new RegExp(/^[0-9]{1,4}$/);
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    if (!regex2.test(key)) {
      event.preventDefault();
      return false;
    }
  }
  clear() {
    this.counterBet = 0;
  }
}
