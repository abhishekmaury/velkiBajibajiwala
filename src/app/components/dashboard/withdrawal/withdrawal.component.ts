import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { Location } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css'],
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
export class WithdrawalComponent implements OnInit {
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
  channelslist: any;
  showKeyboard = false;
  refreshBtn = false;
  accountNumber: any;
  selectchannel: any;
  mobileNumber: any
  errMsg = '';
  constructor(private dataServe: DataHandlerService, private location: Location) { }

  ngOnInit(): void {
    this.dataServe.getBalInfo().subscribe((res: any) => {
      this.balInfo = res;
    })

    let data = localStorage.getItem('userData');
    if (data) {
      let loginResData = JSON.parse(data);
      // this.mobileNumber = loginResData.mobileNumber
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
      "category": "WithDraw"
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
      "category": "WithDraw"
    }
    this.dataServe.loadMethodNumbers(data).subscribe((res: any) => {
      // console.log(JSON.parse(res?.method));
    })
  }
  goBack(): void {
    this.location.back();
  }
  upDateBalance() {
    this.refreshBtn = true;
    this.dataServe.getBalInfo().subscribe((res: any) => {
      this.balInfo = res
      this.refreshBtn = true;
      setTimeout(() => {
        this.refreshBtn = false;
      }, 500);
    })
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



  createManualWithdrawRequest() {
    if (this.stakeValue == 0 || this.stakeValue == null || this.stakeValue == undefined || this.stakeValue < 100 || this.stakeValue > 25000) {
      this.isError = true;
      this.showMessage = true;
      this.errMsg = 'Sorry! your amount Invalid.';
    } else if (this.selectedPayMethod == null || this.selectedPayMethod == undefined || this.selectedPayMethod === '') {
      this.isError = true;
      this.showMessage = true;
      this.errMsg = 'Sorry! Please Select Payment Method';
    } else if (this.mobileNumber == null || this.mobileNumber == undefined || this.mobileNumber === '' || this.mobileNumber.length === 0
    ) {
      this.isError = true;
      this.showMessage = true;
      this.errMsg = 'Sorry! Please enter your mobile number';

    } else {
      const data = {
        selectedAmount: Number(this.stakeValue),
        selectedMethod: this.selectedPayMethod,
        selectedNumber: this.accountNumber,
        selectedChannel: this.selectchannel,
        userNumber: this.mobileNumber
      };

      this.dataServe.createManualWithdrawRequest(data).subscribe((res: any) => {
        if (res?.status == 200) {
          this.errMsg = "Withdrawal request submitted";
          this.showMessage = true;
          this.isError = false;
        } else {
          this.showMessage = true;
          this.isError = true;
          this.errMsg = res?.body?.message;
        }
      })
    }
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }
  addValue(value: any) {
    this.stakeValue = value;
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
  openKeyboard() {
    this.showKeyboard = true;
  }

  closeKeyboard() {
    this.showKeyboard = false;
  }
  onKeyPress(value: string) {
    if (value === 'backspace') {
      this.stakeValue = this.stakeValue.slice(0, -1);
    } else if (this.stakeValue.length < 8) {
      this.stakeValue += value;
    }
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  sanitizeNumber() {
    this.mobileNumber = this.mobileNumber?.replace(/[^0-9]/g, '') || '';
  }

}
