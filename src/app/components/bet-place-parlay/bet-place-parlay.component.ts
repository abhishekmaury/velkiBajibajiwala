import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-bet-place-parlay',
  templateUrl: './bet-place-parlay.component.html',
  styleUrls: ['./bet-place-parlay.component.css'],
  standalone:true,
  imports:[CommonModule,LoaderComponent],
})
export class BetPlaceParlayComponent implements OnInit {
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
  stakeArr: any;
  loginResData: any;
  stake = { 'stake1': '10', 'stake2': '20', 'stake3': '50', 'stake4': '100', 'stake5': '500', 'stake6': '1000' };
  stakesetting = false;
  stakeFocusnum = 1;
  stakeNumPad = [1,2,3,4,5,6,7,8,9,'',0,]


  constructor(private router: Router, private dataServe: DataHandlerService) { }

  ngOnInit(): void {
    let btct = localStorage.getItem('parlayOdds')
    if (btct) {
      this.betsList = JSON.parse(btct)
      this.oddsCalculation(this.betsList)
    }

    let data1 = localStorage.getItem('updatedStake');
    let data = localStorage.getItem('userData');
    if(data1){
      this.loginResData = JSON.parse(data1);
      this.stakeArr = this.loginResData;
    }else if(data){
      this.loginResData = JSON.parse(data);
      this.stakeArr = this.loginResData.stake;
    }else{
      this.stakeArr = this.stake;
    }
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

  addStaticStake(stake: any) {
    this.showStake += stake
    this.enableBtn = true
    this.maxProfitCal()
  }
  addStakValue(val: any, tr: any) {
    this.enableBtn = tr
    const numVal = Number(val);
    const numCounter = Number(this.showStake) || 0; // fallback if undefined

    this.showStake = numCounter + numVal;
    return this.showStake
  }
  addStaticVal1(num: any, tr: any) {
    if (this.showStake == 0) {
      this.showStake = num
      this.enableBtn = tr
    } else {
      this.showStake = `${this.showStake}${num}`
    }
    this.maxProfitCal()
  }
  deleteLastNum() {
    this.showStake = +this.showStake.toString().slice(0, -1);
    if (this.showStake == 0) {
      this.enableBtn = false
    }
    this.maxProfitCal()
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
      if (diffEvent.length === 0) {
        this.cancelBet();
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
      if (this.betsList.length >= 2) {
        this.dataServe.placeParlayBets(this.betsList, this.showStake).subscribe((res: any) => {
          if (res.type == 'success') {
            this.closeBet = false;
            this.successBet = true;
            this.cancelBet();

            localStorage.removeItem('parlayType')
            localStorage.removeItem('parlayOdds')
            this.closeDt.emit([])

            this.dataServe.betSuccessParlay(this.successBet, this.showStake, res)
          } else {
            this.closeBet = false;
            this.loading = false;
            this.successBet = false;
            this.cancelBet();
            this.dataServe.betSuccessParlay(this.successBet, this.showStake, res)
          }

        }, (error: any) => {
          this.cancelBet();
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          this.dataServe.betSuccessParlay(this.successBet, this.showStake, error)
        })
      } else {
        this.closeBet = false;
        this.loading = false;
        this.successBet = false;
        let ddt = { "type": "error", "message": "Please Select min. 2 Parlay for bet placing", "title": "Oops..." }
        this.dataServe.betSuccessParlay(this.successBet, this.showStake, ddt)
      }
    } else {
      this.router.navigate(['/login'])
    }
  }
  formatMatchName(name: string): string {
    if (!name) return '';

    const parts = name.split(' v ');
    if (parts.length === 2) {
      return `<span class='font-bold'>${parts[0]}</span>
            <span class='font-normal'>vs</span>
            <span class='font-bold'>${parts[1]}</span>`;
    }

    return name;
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
