import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stake-settings',
  templateUrl: './stake-settings.component.html',
  styleUrls: ['./stake-settings.component.css']
})
export class StakeSettingsComponent implements OnInit{
  stakeNumPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0,]
  stakeArr : any;
  loginResData : any;
  stakeFocusnum = 1;
  stake = { 'stake1': '10', 'stake2': '20', 'stake3': '50', 'stake4': '100', 'stake5': '500', 'stake6': '1000' };


  ngOnInit(): void {
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
  closeStake(){
    
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
}
