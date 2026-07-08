import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { FingerprintService } from '../../services/fingerprint.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';


@Component({
  selector: 'app-bet-place',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bet-place.component.html',
  styleUrls: ['./bet-place.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class BetPlaceComponent implements OnInit {
  @Input() clsClr: any
  @Input() data: any
  @Input() updOddsBack: any
  @Input() updOddsLay: any
  @Input() socketEventData: any
  @Input() isInplay: any;
  @Input() fancyLimit: any;
  @Input() minLimit: any;
  @Input() maxLimit: any;
  @Input() bmLimit: any;
  @Input() lowLiquidity : any;
  @Input() totalMatched : any;
  @Output() betResult = new EventEmitter()
  @Output() stopTimer = new EventEmitter()
  closeBet = true;
  counterBet: any;
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
  validateapi: any;
  fingerprintHash = '';
  deviceId: string = '';
  fingerData: any;
  disabled = false;

  stake = { 'stake1': '10', 'stake2': '20', 'stake3': '50', 'stake4': '100', 'stake5': '500', 'stake6': '1000' };
  numPadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '00']
  enableBtn = false

  constructor(private router: Router, private dataServe: DataHandlerService, private fingerprintService: FingerprintService) { }

  ngOnInit(): void {
    this.profit.push(this.data)

    let data1 = localStorage.getItem('userStake');
    let data = localStorage.getItem('userData');
    if (data) {
      let locdt = JSON.parse(data)
      this.LocalLimit = locdt.data.user;
      this.getCount();
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
    if (this.disabled) {
      return
    }
    this.disabled = true
    this.loading = true;
    this.stopTimer.emit(this.loading)
    let token = localStorage.getItem('token')
    if (token) {

      this.selectedodds = this.data[0].odds;

      if (this.data[0].sourceBetType === '') {

        if(this.totalMatched>this.lowLiquidity){
          if (this.socketEventData.status == true) {

            if ((this.socketEventData.markets[0].marketName == 'Match Odds') && (this.socketEventData.markets[0].status == true)) {

              this.oddsLimit = this.socketEventData.markets[0].limit[1].b2CoddsLimit;

              if (this.LocalLimit.currency == 'BDT') {
                if (this.isInplay == true) {
                  this.oddminStake = 10;
                  this.oddmaxStake = this.socketEventData.markets[0].limit[2].b2CmaxStake;
                } else {
                  this.oddminStake = 10;
                  this.oddmaxStake = this.socketEventData.markets[0].limit[2].b2CpreMaxStake;
                }
              } else {
                if (this.isInplay == true) {
                  this.oddminStake = 10;
                  this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CmaxStake;
                } else {
                  this.oddminStake = 10;
                  this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CpreMaxStake;
                }
              }


              if ((this.oddminStake <= this.counterBet) && (this.oddmaxStake >= this.counterBet)) {

                if (this.oddsLimit >= this.selectedodds) {
                  if (this.data[0].isBack == true) {

                    if ((this.updOddsBack >= this.data[0].odds) && ((this.updOddsBack - this.data[0].odds) <= 0.05)) {

                      // this.dataServe.setMatchOddsBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
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

                      // this.dataServe.setMatchOddsBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
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
        } else {
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          this.disabled = false;
          let res = {"type":"error","message":"Low Liquidity Game","title":"Oops..."};

          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
        }

      } else if (this.data[0].sourceBetType === 'book') {
        if (this.socketEventData.status == true) {

          if ((this.socketEventData.markets[0].marketName == 'Bookmaker') && (this.socketEventData.markets[0].status == true)) {

            this.oddsLimit = this.socketEventData.markets[0].limit[1].b2CoddsLimit;
            this.selectedodds = (this.data[0].odds / 100);

            if (this.LocalLimit.currency !== 'BDT') {
              if (this.bmLimit == false) {
                if (this.isInplay == true) {
                  this.oddminStake = 10;
                  this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CmaxStake;
                } else {
                  this.oddminStake = 10;
                  this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CpreMaxStake;
                }
              } else {
                this.oddminStake = 10;
                this.oddmaxStake = this.maxLimit;
              }
            }


            if ((this.oddminStake <= this.counterBet) && (this.oddmaxStake >= this.counterBet)) {

              if (this.oddsLimit >= this.selectedodds) {

                if (this.data[0].isBack == true) {

                  if ((this.updOddsBack >= this.data[0].odds) && ((this.updOddsBack - this.data[0].odds) <= 0.05)) {

                    // this.dataServe.setMatchOddsBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
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

                    // this.dataServe.setMatchOddsBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
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
                let res = { "type": "error", "message": "Max odds limit is " + (this.oddsLimit * 100), "title": "Oops..." };

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

      } else if (this.data[0].sourceBetType === 'toss') {

        if (this.socketEventData.status == true) {

          if ((this.socketEventData.markets[0].marketName == 'Toss') && (this.socketEventData.markets[0].status == true)) {

            this.oddsLimit = this.socketEventData.markets[0].limit[1].b2CoddsLimit;
            if (this.LocalLimit.currency == 'BDT') {
              if (this.isInplay == true) {
                this.oddminStake = 10;
                this.oddmaxStake = this.socketEventData.markets[0].limit[2].b2CmaxStake;
              } else {
                this.oddminStake = 10;
                this.oddmaxStake = this.socketEventData.markets[0].limit[2].b2CpreMaxStake;
              }
            } else {
              if (this.isInplay == true) {
                this.oddminStake = 10;
                this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CmaxStake;
              } else {
                this.oddminStake = 10;
                this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CpreMaxStake;
              }
            }

            if ((this.oddminStake <= this.counterBet) && (this.oddmaxStake >= this.counterBet)) {

              if (this.oddsLimit >= this.selectedodds) {
                if (this.data[0].isBack == true) {

                  // this.dataServe.setTossMatchBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
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
                  //       this.successBet = false
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

      } else if (this.data[0].sourceBetType === 'Fancy' || this.data[0].sourceBetType === 'Fancy1') {

        if (this.socketEventData.status == true) {

          if ((this.socketEventData.markets[0].marketName == 'Fancy') && (this.socketEventData.markets[0].status == true)) {

            this.oddsLimit = this.socketEventData.markets[0].limit[1].b2CoddsLimit;

            if (this.LocalLimit.currency !== 'BDT') {
              if (this.fancyLimit == false) {
                if (this.isInplay == true) {
                  this.oddminStake = 10;
                  this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CmaxStake;
                } else {
                  this.oddminStake = 10;
                  this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CpreMaxStake;
                }
              } else {
                this.oddminStake = 10;
                this.oddmaxStake = this.maxLimit;
              }
            }

            if ((this.oddminStake <= this.counterBet) && (this.oddmaxStake >= this.counterBet)) {

              if (this.oddsLimit >= this.data[0].selectionName) {
                if (this.data[0].isBack == true) {
                  console.log(this.updOddsBack == this.data[0].odds);

                  if (this.updOddsBack == this.data[0].odds) {
                    if (this.data[0].sourceBetType === 'Fancy1') {
                      // this.dataServe.setFancy1MatchBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
                      // }, (error: any) => {
                      //   if (error.status == 200) {
                      //     let res1 = this.dataServe.decryptData(error.error.text);
                      //     let res = res1.data;
                      //     if (res.type === 'success') {
                      //       this.closeBet = false;
                      //       this.successBet = true;
                      //       this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                      //     } else {
                      //       this.closeBet = false;
                      //       this.loading = false;
                      //       this.successBet = false
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
                      // this.dataServe.setFancyMatchBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
                      // }, (error: any) => {
                      //   if (error.status == 200) {
                      //     let res1 = this.dataServe.decryptData(error.error.text);
                      //     let res = res1.data;
                      //     if (res.type === 'success') {
                      //       this.closeBet = false;
                      //       this.successBet = true;
                      //       this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                      //     } else {
                      //       this.closeBet = false;
                      //       this.loading = false;
                      //       this.successBet = false
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
                    }
                  } else {
                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = { "type": "error", "message": "Odds Changed, Bet can't be placed", "title": "Oops..." };

                    this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                  }

                } else {

                  if (this.updOddsLay == this.data[0].odds) {
                    if (this.data[0].sourceBetType === 'Fancy1') {
                      // this.dataServe.setFancy1MatchBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
                      //   if (res.type === 'success') {
                      //     this.closeBet = false;
                      //     this.successBet = true;
                      //     this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                      //   } else {
                      //     this.closeBet = false;
                      //     this.loading = false;
                      //     this.successBet = false
                      //     this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                      //   }
                      // })
                    } else {
                      // this.dataServe.setFancyMatchBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
                      // }, (error: any) => {
                      //   if (error.status == 200) {
                      //     let res1 = this.dataServe.decryptData(error.error.text);
                      //     let res = res1.data;
                      //     if (res.type === 'success') {
                      //       this.closeBet = false;
                      //       this.successBet = true;
                      //       this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                      //     } else {
                      //       this.closeBet = false;
                      //       this.loading = false;
                      //       this.successBet = false
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
                    }
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

      } else if (this.data[0].sourceBetType === 'premium') {

        if (this.socketEventData.status == true) {

          if ((this.socketEventData.markets[0].marketName == 'Premium Fancy') && (this.socketEventData.markets[0].status == true)) {

            this.oddsLimit = this.socketEventData.markets[0].limit[1].oddsLimit;

            if (this.LocalLimit.currency == 'BDT') {
              if (this.isInplay == true) {
                this.oddminStake = 10;
                this.oddmaxStake = this.socketEventData.markets[0].limit[2].b2CmaxStake;
              } else {
                this.oddminStake = 10;
                this.oddmaxStake = this.socketEventData.markets[0].limit[2].b2CpreMaxStake;
              }
            } else {
              if (this.isInplay == true) {
                this.oddminStake = 10;
                this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CmaxStake;
              } else {
                this.oddminStake = 10;
                this.oddmaxStake = this.socketEventData.markets[0].limit[1].b2CpreMaxStake;
              }
            }


            if ((this.oddminStake <= this.counterBet) && (this.oddmaxStake >= this.counterBet)) {

              if (this.oddsLimit >= this.selectedodds) {
                if (this.updOddsBack == this.data[0].odds) {

                  // this.dataServe.setPremiumMatchBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
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
                  //       this.successBet = false
                  //       this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                  //     }

                  //   } else if (error.status == 503) {
                  //     // let res1 = this.dataServe.decryptData1(error.error);
                  //     // let res = res1.data
                  //     // console.log(res, error);
                  //     let res = { "type": "error", "message": "Please Wait for some time", "title": "Oops..." }
                  //     this.closeBet = false;
                  //     this.loading = false;
                  //     this.successBet = false;
                  //     this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
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

      } else if (this.data[0].sourceBetType === 'Other') {

        let afterSocketEveDt = this.socketEventData.markets.filter((dt: any) => {
          if (dt.marketName == this.data[0].marketName) {
            return dt;
          }
        })

        if (this.socketEventData.status == true) {

          if (afterSocketEveDt[0].status == true) {

            this.oddsLimit = afterSocketEveDt[0].limit[2].b2CoddsLimit;

            if (this.LocalLimit.currency == 'BDT') {
              if (this.isInplay == true) {
                this.oddminStake = 10;
                this.oddmaxStake = afterSocketEveDt[0].limit[2].b2CmaxStake;
              } else {
                this.oddminStake = 10;
                this.oddmaxStake = afterSocketEveDt[0].limit[2].b2CpreMaxStake;
              }
            } else {
              if (this.isInplay == true) {
                this.oddminStake = 10;
                this.oddmaxStake = afterSocketEveDt[0].limit[1].b2CmaxStake;
              } else {
                this.oddminStake = 10;
                this.oddmaxStake = afterSocketEveDt[0].limit[1].b2CpreMaxStake;
              }
            }

            if ((this.oddminStake <= this.counterBet) && (this.oddmaxStake >= this.counterBet)) {

              if (this.oddsLimit >= this.selectedodds) {
                if (this.data[0].isBack == true) {

                  if ((this.updOddsBack >= this.data[0].odds) && ((this.updOddsBack - this.data[0].odds) <= 0.05)) {

                    // this.dataServe.setOtherMarketBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
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

                    // this.dataServe.setOtherMarketBet(this.data[0], this.counterBet, this.fingerprintHash, this.deviceId, this.fingerData).subscribe((res: any) => {
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
      this.router.navigate(['/mob-login'])
    }
    setTimeout(() => {
      this.disabled = false;
    }, 2000);
  }

  getCount() {
    let sectime = this.dataServe.getTimeStamp();
    let data = { "eventId": this.data[0].eventId, "sourceType": this.data[0].sourceBetType, "sourceId": this.data[0].sourceId, "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }
    // this.dataServe.verifyUser(data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataServe.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataServe.updateUserModalCount(data).subscribe((res: any) => {
    //       }, (error) => {
    //         let msd = this.dataServe.decryptData(error.error.text);
    //       })
    //     }
    //   }
    // })
  }


}

