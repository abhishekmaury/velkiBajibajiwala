import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-deposit-reciept',
  templateUrl: './deposit-reciept.component.html',
  styleUrls: ['./deposit-reciept.component.css'],
  standalone:true,
  imports:[FormsModule,ReactiveFormsModule],
})
export class DepositRecieptComponent {

  validateapi: any;
  token: any;
  websiteId: any;
  amount: any = '';
  depositdata: any;
  loggedData: any;
  mobileNum: any;
  base64Image: any;
  refereceNo: any;
  errMsg: any;
  showErrPopup = false;
  showSucPopup = false;
  mobileNo: any;
  interval: any;
  minutes: any;
  seconds = 0;
  openConfirmDepo = false;
  recForm: any;
  isCopied = false;
  isLoading = false;
  headerLogo: any;
  inputValue: string = '';

  constructor(private routerActive: ActivatedRoute, private router: Router, private dataserve: DataHandlerService) { }

  ngOnInit(): void {
    this.routerActive.paramMap.subscribe((param: any) => {
      let data = param.get('data')
      this.depositdata = this.dataserve.decodejwt(JSON.stringify(data));
      // console.log(this.depositdata);
      let milliseconds = this.depositdata.createdLong;
      const seconds = milliseconds / 1000;
      this.minutes = 10;
      this.startTimer()
    })

    let lsData = localStorage.getItem('userData');
    if (lsData) {
      this.loggedData = JSON.parse(lsData);
      this.mobileNum = this.loggedData.mobileNumber;
      // console.log(this.mobileNum);

    }
    let webdata = localStorage.getItem("webData");
    if (webdata) {
      let formatedDt = JSON.parse(webdata)
      this.headerLogo = formatedDt?.logo;
    }
    this.recForm = new FormGroup({
      userNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/u)]),
      userTransId: new FormControl('', [Validators.required, Validators.pattern(/^(?!.*[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}])^[a-zA-Z0-9]*$/u)]),
      transRecp: new FormControl('',)
    })
  }
  get phoneNum() {
    return this.recForm.get('userNumber');
  }
  get transId() {
    return this.recForm.get('userTransId');
  }
  updateUserTransDetail(eve: any) {
    if (this.recForm.valid) {
      this.isLoading = true;
      if (this.base64Image == undefined) {
        this.base64Image = '';
      }

      let data = {
        "ourTransId": this.depositdata.transactionId,
        "userTransId": this.recForm.value.userTransId.toUpperCase(),
        "userNumber": this.mobileNum,
        "transRecp": this.base64Image
      }
      console.log(data);

      this.dataserve.updateManualUserTransDetails(data).subscribe((res : any)=>{
        console.log(res);
        if (res?.type == 'error') {
        this.errMsg = res?.message;
      }else{
        this.showSucPopup = true;
        this.errMsg = res.message;
      }

      })
    }
    else {
      this.errMsg = 'Please fill all Fields'
      this.recForm.markAllAsTouched();
      setTimeout(() => {
        this.errMsg = '';
      }, 3000);
    }
  }

  uploadeImg(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result?.toString()?.split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }
  getReferenceNo(data: any) {
    let referno = data.target.value;
    this.refereceNo = referno.toUpperCase()
  }

  getMobileNo(data: any): any {
    this.mobileNum = data.target.value;
    let regex = new RegExp("^[a-zA-Z0-9]+$");
    let regex2 = new RegExp(/^[0-9]{1,4}$/);
    let key = String.fromCharCode(!data.charCode ? data.which : data.charCode);
    if (!regex.test(key)) {
      data.preventDefault();
      return false;
    }
    if (!regex2.test(key)) {
      data.preventDefault();
      return false;
    }
  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        if (this.minutes === 0 && this.seconds === 0) {
          clearInterval(this.interval);
          this.router.navigate([`/menu/deposit`])
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      }
    }, 1000);
  }
  closeWindow() {
    this.router.navigate([`/menu/deposit`])
  }

  copyToClipboard(data: string): void {
    const url = data;
    navigator.clipboard.writeText(url).then(() => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  preventSpace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }


  trimInput(): void {
    this.inputValue = this.inputValue.trim();
  }

  hindNumber(value: any) {
    const str = value.toString();
    return str.slice(0, 2) + '*'.repeat(7) + str.slice(-3);
  }
}
