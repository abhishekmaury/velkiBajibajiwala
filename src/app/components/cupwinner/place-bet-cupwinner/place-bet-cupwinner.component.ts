import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { HandlerService } from 'src/app/services/handler.service';

@Component({
  selector: 'app-place-bet-cupwinner',
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
  @Input() oddcal: any;
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
  confirmpopup = false;
  webdata: any;
  jsonWebdt: any;

  stake = { 'stake1': '10', 'stake2': '20', 'stake3': '50', 'stake4': '100', 'stake5': '500', 'stake6': '1000' };
  numPadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '00', '.']
  enableBtn = false
  stakeNumPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0,]
  stakesetting = false;
  stakeFocusnum = 1;

  constructor(private router: Router, private dataServe: DataHandlerService, private popupService: HandlerService) { }

  ngOnInit(): void {
    this.profit.push(this.data)

    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
    }

    let data1 = localStorage.getItem('updatedStake');
    let data = localStorage.getItem('userData');
    if (data1) {
      this.loginResData = JSON.parse(data1);
      this.stakeArr = this.loginResData;
    } else if (data) {
      this.loginResData = JSON.parse(data);
      this.stakeArr = this.loginResData.stake;
    } else {
      this.stakeArr = this.stake;
    }
  }
  addStakValue(val: any, tr: any) {
    this.enableBtn = tr
    // this.counterBet = val
    const numVal = Number(val);
  const numCounter = Number(this.counterBet) || 0; // fallback if undefined

  this.counterBet = numCounter + numVal;
    this.oddsbetCalculation(this.counterBet)
    return this.counterBet
  }

  cancelBet() {
    this.closeBet = false
    this.counterBet = 0
    this.betResult.emit(this.closeBet)
    return this.counterBet
  }
  closeConfirm() {
    this.confirmpopup = false
  }
  minusCounter(tr: any) {
    if (this.counterBet > 5) {
      this.counterBet -= 5;
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
    this.counterBet += 5;
    this.oddsbetCalculation(this.counterBet)
    return this.counterBet
  }
  addStaticVal1(num: any, tr: any) {
    if (num !== '.') {
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

  confirmplacebet() {
    this.confirmpopup = true;
  }

  placeBetFunc() {
    this.loading = true;
    this.stopTimer.emit(this.loading)
    let token = localStorage.getItem('token')
    if (token) {

      this.selectedodds = this.data[0].odds;

      let betcheck = localStorage.getItem('placebetcheck')
      if (betcheck == 'false' || betcheck == null) {
        if (this.data[0].sourceBetType === 'Odds') {
          if (this.socketEventData.status == true) {
            if ((this.socketEventData.markets[0].marketName == 'Match Odds') && (this.socketEventData.markets[0].status == true)) {
              this.oddsLimit = this.socketEventData.markets[0].limit[0].oddsLimit;
              if (this.isInplay == true) {
                this.oddminStake = this.socketEventData.markets[0].limit[0].minStake;
                this.oddmaxStake = this.socketEventData.markets[0].limit[0].maxStake;
              } else {
                this.oddminStake = this.socketEventData.markets[0].limit[0].preMinStake;
                this.oddmaxStake = this.socketEventData.markets[0].limit[0].preMaxStake;
              }

              if ((this.oddminStake <= this.counterBet) && (this.oddmaxStake >= this.counterBet)) {

                if (this.oddsLimit >= this.selectedodds) {
                  if (this.data[0].isBack == true) {

                    if ((this.updOddsBack >= this.data[0].odds) && ((this.updOddsBack - this.data[0].odds) <= 0.05)) {
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.setWinnerBet(this.data[0], this.counterBet).subscribe((res: any) => {
                        if (res.type === 'success') {
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false
                          this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = { "type": "error", "message": "Rapid Bets are not allowed", "title": "Oops..." };
                          this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })

                    } else {
                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false;
                      let res = { "type": "error", "message": "Odds Changed, Bet can't be placed", "title": "Oops..." };
                      this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                    }
                  } else {
                    if ((this.updOddsLay <= this.data[0].odds) && (this.data[0].odds - this.updOddsLay) <= 0.05) {
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.setWinnerBet(this.data[0], this.counterBet).subscribe((res: any) => {
                        if (res.type === 'success') {
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false
                          this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = { "type": "error", "message": "Rapid Bets are not allowed", "title": "Oops..." };
                          this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })

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
        this.closeBet = false;
        this.loading = false;
        this.successBet = false;
        let res = { "type": "error", "message": "Rapid Bets are not allowed", "title": "Oops..." };
        this.dataServe.betSuccess(this.successBet, this.data[0], this.counterBet, res)
      }
    } else {
      this.router.navigate(['/login'])
    }
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
  closePopup() {
    this.popupService.closeBetPopup();
  }


  openStakeSetting() {
    this.stakesetting = true
  }
  closeStake() {
    this.stakesetting = false
    let data1 = localStorage.getItem('updatedStake');
    let data = localStorage.getItem('userData');
    if (data1) {
      this.loginResData = JSON.parse(data1);
      this.stakeArr = this.loginResData;
    } else if (data) {
      this.loginResData = JSON.parse(data);
      this.stakeArr = this.loginResData.stake;
    } else {
      this.stakeArr = this.stake;
    }
  }
  stakeFocus(index: any) {
    this.stakeFocusnum = index;
  }
  numpadnum(num: any) {
    if (this.stakeFocusnum == 1) {
      this.stakeArr.stake1 = `${this.stakeArr.stake1}${num}`
    } else if (this.stakeFocusnum == 2) {
      this.stakeArr.stake2 = `${this.stakeArr.stake2}${num}`
    } else if (this.stakeFocusnum == 3) {
      this.stakeArr.stake3 = `${this.stakeArr.stake3}${num}`
    } else if (this.stakeFocusnum == 4) {
      this.stakeArr.stake4 = `${this.stakeArr.stake4}${num}`
    }
  }
  deleteLastNumStake() {
    if (this.stakeFocusnum == 1) {
      this.stakeArr.stake1 = +this.stakeArr.stake1.toString().slice(0, -1);
    } else if (this.stakeFocusnum == 2) {
      this.stakeArr.stake2 = +this.stakeArr.stake2.toString().slice(0, -1);
    } else if (this.stakeFocusnum == 3) {
      this.stakeArr.stake3 = +this.stakeArr.stake3.toString().slice(0, -1);
    } else if (this.stakeFocusnum == 4) {
      this.stakeArr.stake4 = +this.stakeArr.stake4.toString().slice(0, -1);
    }

  }

  updateStake() {
    let data = {
      stake1: this.stakeArr.stake1,
      stake2: this.stakeArr.stake2,
      stake3: this.stakeArr.stake3,
      stake4: this.stakeArr.stake4,
    }
    this.dataServe.editStake(data).subscribe((res: any) => {
      // console.log(res);
      if (res) {
        this.stakeArr = res;
        localStorage.setItem('updatedStake', JSON.stringify(res));
        this.stakesetting = false
      }

    })
  }
}
