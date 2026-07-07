import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { Location } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class DepositComponent implements OnInit {
  balInfo: any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  selectedPayMethod: any;
  showlimit = false;
  isCollapse = false;
  showMessage = false;
  isError = false;
  stakeValue: any = '';
  userName: any;
  showKeyboard = false;
  channelslist: any;
  accountNumber: any;
  errMsg: any = '';
  selectchannel : any;

  constructor(private dataServe: DataHandlerService, private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.dataServe.getBalInfo().subscribe((res: any) => {
      this.balInfo = res;
    })
    let data = localStorage.getItem('userData');
    if (data) {
      let loginResData = JSON.parse(data);
      this.userName = loginResData.userid;

    }

    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing = this.jsonWeblinksdt?.validShowing;
    }

    this.loadManualDWChannels()
  }

  loadManualDWChannels() {
    let data = {
      "category": "Deposit"
    }
    this.dataServe.loadManualDWChannels(data).subscribe((res: any) => {
      // console.log(res);
      this.channelslist = res;
    })
  }
  loadMethodNumbers(paymentMethod: any) {
    let data = {
      "method": paymentMethod?.method,
      "channel": paymentMethod?.userId,
      "category": "Deposit"
    }
    this.dataServe.loadMethodNumbers(data).subscribe((res: any) => {
      // console.log(JSON.parse(res?.method));
    })
  }
  createManualDepositRequest() {
    if (this.stakeValue == 0 || this.stakeValue == null || this.stakeValue == undefined || this.stakeValue < 100 || this.stakeValue > 25000) {
      this.isError = true;
      this.showMessage = true;
      this.errMsg = 'Sorry! your amount Invalid.';
    } else if (this.selectedPayMethod == null || this.selectedPayMethod == undefined || this.selectedPayMethod === '') {
      this.isError = true;
      this.showMessage = true;
      this.errMsg = 'Sorry! Please Select Payment Method';
      // } else if (this.selectedchannel == null || this.selectedchannel == undefined || this.selectedchannel === '') {
      //   this.isError = true;
      //   this.errMsg = 'Sorry! Please Select Channel';
    } else {
      let data = {
        "selectedAmount": this.stakeValue,
        "selectedMethod": this.selectedPayMethod,
        "selectedChannel": this.selectchannel,
        "selectedNumber": this.accountNumber
      }

      this.dataServe.createManualDepositRequest(data).subscribe((res: any) => {
        // console.log(res);
        if (res?.type == 'error') {
          this.showMessage = true;
          this.isError = true;
          this.errMsg = res?.message;
        }else{
//      let res = {
//     "transToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNzYzNDgwNjM1MDM3NjkwNzQiLCJhbW91bnQiOjEwMC4wLCJhZGRyZXNzIjoiMDIzNTY4Nzg3NzgiLCJtZXRob2QiOiJuYWdhZCIsImNoYW5uZWwiOiJtYXN0ZXJ0ZXN0IiwiZXhwIjoxNzYzNDgwNjk1LCJjcmVhdGVkT24iOiIyMDI1LTExLTE4IDIxOjEzOjU1IiwiY3JlYXRlZExvbmciOjE3NjM0ODA2MzUwMzcsInVzZXJJZCI6InVzZXIyIiwiaWF0IjoxNzYzNDgwNjM1LCJ0cmFuc2FjdGlvbklkIjoiMTc2MzQ4MDYzNTAzNzY5MDc0In0.0CBNeViBjTE0A5-lmfBg0w01NXfLUcs2gPQ_HhTtDIs",
//     "currentTime": 1763480635038
// }
          this.router.navigate([`/deposit-rec/${res?.transToken}`], { skipLocationChange: true })
          this.errMsg = res?.message;
          this.showMessage = true;
          this.isError = false;
        }
      })
    }
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }

  goBack(): void {
    this.location.back();
  }
  selectPaymethod(data: any) {
    this.selectedPayMethod = data?.method;
    this.accountNumber = data?.accountNumber;
    this.selectchannel = data?.userId
    this.showlimit = true;

    this.loadMethodNumbers(data);

  }
  collapseRule() {
    this.isCollapse = !this.isCollapse
  }
  closeBet() {
    this.showMessage = false;
  }


  addValue(value: any) {
    this.stakeValue = value;
  }
  openKeyboard() {
    this.showKeyboard = true;
  }

  closeKeyboard() {
    this.showKeyboard = false;
  }
  getActivemethod(isActive: any) {
    if (isActive) {
      return {
        'background-image': this.jsonWebdt?.imagesBottomBorderColor,
        'color': this.jsonWebdt?.imagesPlayNowTextColor
      };
    } else {
      return {
        'border-color': '#7e919e',
        'color': '#000'
      }
    }
  }
  onKeyPress(value: string) {
    if (value === 'backspace') {
      this.stakeValue = this.stakeValue.slice(0, -1);
    } else if (this.stakeValue.length < 8) {
      this.stakeValue += value;
    }
  }
}
