import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { FingerprintService } from 'src/app/services/fingerprint.service';
import { trimValidator } from 'src/app/services/trim.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loggedData!: FormGroup;
  errMsg: string = '';
  loginResData: any;
  validationCode: any;
  loginflag: boolean = false;
  true: boolean = true;
  sendLoggedData4 = new Subject<any>();
  webdata: any;
  jsonWebdt: any;
  showpwrd = false;
  rememberme = false;
  jsonWeblinksdt: any;
  validShowing='true';
  backgroundImg = '';
  innrrImg : any = '';
  submitted = false;
  fingerprint: any;
  isRefreshing = false;

  constructor(
    private location: Location,private fingerprintService: FingerprintService,
    private dataServe: DataHandlerService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.fingerprintService.getFingerprint().then(visitorId => {
      this.fingerprint = visitorId;
    });

    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.backgroundImg = this.webdata?.imageData?.headers?.[0]?.mobile_login_image;
      this.innrrImg = this.webdata?.imageData?.headers?.[0]?.web_login_image;
      this.jsonWebdt = JSON.parse(d1?.theme)
      this.jsonWeblinksdt = JSON.parse(d1?.links)
      this.validShowing=this.jsonWeblinksdt.validShowing;
    }

    this.dataServe.sendLoggedData2.subscribe((res: any) => {
      this.errMsg = res
    })
    this.generateValidationCode()
    if (this.validShowing == 'true') {
      this.loggedData = new FormGroup({
        userId: new FormControl(null, [Validators.required, Validators.maxLength(30), trimValidator()]),
        pass: new FormControl(null,  [Validators.required,Validators.max(30), trimValidator()]),
        validCode: new FormControl(null, [Validators.required,Validators.required, Validators.pattern(/^[0-9]{1,4}$/), Validators.max(4)])
      })
    } else {
      this.loggedData = new FormGroup({
        userId: new FormControl(null, [Validators.maxLength(30), trimValidator()]),
        pass: new FormControl(null, [Validators.max(30), trimValidator()])
      })
    }

  }
  openWhtlink(){
    window.open(this.jsonWeblinksdt?.signupContent, '_blank');
    // window.open(this.jsonWeblinksdt?.whatsappContent, '_blank');
  }
  rememberMe(){
    this.rememberme = !this.rememberme
  }
  pop1() {
    location.replace("/myAccount/home");
  }
  get userId() {
    return this.loggedData.get("userId")
  }
  get pass() {
    return this.loggedData.get("pass")
  }
  get validCode() {
    return this.loggedData.get("validCode")
  }
  login() {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    this.submitted = true;
    if(this.validShowing == 'true') {
      if(this.loggedData.value.userId?.trim()){
        if(this.loggedData.value.pass?.trim()){
          if(this.loggedData.value.validCode != null){
            if(this.validationCode == this.loggedData.value.validCode) {
              this.loggedData.value['fp'] = this.fingerprint;
              this.dataServe.validateLogin(this.loggedData.value);
            } else {
              this.errMsg = 'Invalid validation code!'
            }
          }else{
            this.errMsg = 'verifycode cannot be empty'
          }
        }else{
          this.errMsg = 'password cannot be empty'
        }
      }else{
        this.errMsg = 'username cannot be empty'
      }
    } else {
      if ((this.loggedData.value.userId != null) && (this.loggedData.value.pass != null)) {
        this.loggedData.value['fp'] = this.fingerprint;
        this.dataServe.validateLogin(this.loggedData.value);
      } else {
        this.errMsg = 'Username and Password is Required'
      }
    }
    setTimeout(() => {
      this.isRefreshing = false
    }, 1500);
  }

  showpwd() {
    this.showpwrd = !this.showpwrd
  }

  generateValidationCode() {
    var val = Math.floor(1000 + Math.random() * 9000);
    this.validationCode = val;
  }

  numberOnly(event: any): any {
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

  goBack(): void {
    this.location.back();
  }


}
