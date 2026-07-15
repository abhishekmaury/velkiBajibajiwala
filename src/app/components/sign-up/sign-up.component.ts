import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  animations: [
    trigger('fadePopup', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate(
          '250ms ease-in',
          style({ opacity: 0, transform: 'scale(0.95)' }),
        ),
      ]),
    ]),
  ],
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
})
export class SignUpComponent {
  backgroundImg = '';
  webdata: any;
  step1 = true;
  step2 = false;
  registerData: any;
  validationCode: any;
  isValidCode: any;
  regRes: any;
  confirmPasswd: any;
  errMsg: string = '';
  succMsg: string = '';
  validateapi: any;
  currencylist: any;
  logindt: any;
  isLoading = false;
  domainName: any;
  refCodes: any;
  themeData: any;
  showConfirm: boolean = false;
  isMessageVisible: boolean = false;
  isError: boolean = false;
  showpwrd = false;
  isPopupVisible: boolean = false;
  countryCode: string = '';
  headerLogo: any;
  currencyD: string | null = null;
  matchPass: any;
  matchmsg = '';
  uniqueId: any;
  footerLinks: any;
  fingerprintHash = '';
  deviceId: string = '';
  fingerData: any;
  agreeTerms = false;
  submitted = false;
  termNcondition = false;

  constructor(
    private authServe: AuthserviceService,
    private dataserve: DataHandlerService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.domainName = this.authServe.getdomain();
    // this.signupCurrency();
    // this.activeRoute.paramMap.subscribe((param: any) => {
    //   this.refCodes = param.get('refCode')
    //   this.registerData.controls['r' + this.uniqueId].setValue(this.refCodes)
    // })

    let webdata = localStorage.getItem('webData');
    if (webdata) {
      let formatedDt = JSON.parse(webdata);
      this.themeData = formatedDt?.theme;
      // this.headerLogo = formatedDt?.logo;
    }
    this.generateValidationCode();
    let wData = localStorage.getItem('webData');
    if (wData) {
      let d1 = JSON.parse(wData);
      this.webdata = d1;

      this.backgroundImg =
        this.webdata?.imageData?.headers?.[0]?.mobile_login_image;
      this.headerLogo = this.webdata?.imageData?.headers[0]?.logo;
    }
    this.registerData = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.pattern('^[a-zA-Z]+$')]),
      lastName: new FormControl('', [Validators.pattern('^[a-zA-Z]+$')]),
      phoneNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
      ]),
      validationCode: new FormControl('', Validators.required),
    });
  }

  passwordMatch(data: any) {
    this.matchPass = data.target.value;
  }
  confirmMatch(data: any) {
    if (this.matchPass === data.target.value) {
      this.matchmsg = '';
    } else {
      this.matchmsg = 'Password and Confirm Password are not same';
    }
  }

  getValidCode(valid: any) {
    this.isValidCode = valid.target.value;
  }

  get passWord() {
    return this.registerData.get('p' + this.uniqueId);
  }
  selectCountryCode(code: string) {
    this.countryCode = code;
  }

  signUp() {
    this.submitted = true;
    this.isError = false;
    this.errMsg = '';
    this.isMessageVisible = false;

    const form = this.registerData.value;

    if (this.registerData.valid) {
      if (form.password === form.confirmPassword) {
        if (form.validationCode === this.validationCode) {
          if (this.agreeTerms) {
            const fullPhoneNumber = '+880' + form.phoneNumber;
            let payload = {
              userId: form.username.toLowerCase(),
              password: form.password,
              username: form.firstName || '',
              lastName: form.lastName || '',
              mobile: fullPhoneNumber,
              email: form.email || '',
            };
            let data1 = {
              userId: form.username.toLowerCase(),
              pass: form.password,
            };
            this.isLoading = true;

            this.authServe.signUpUser(payload).subscribe(
              (res: any) => {
                this.isLoading = false;
                if (res.type == 'success') {
                  this.succMsg = res.message;
                  this.isError = false;
                  this.isMessageVisible = true;
                  setTimeout(() => {
                    this.authServe.validateLogin(data1);
                    this.router.navigate(['/home']);
                  }, 3000);
                } else {
                  this.isError = true;
                  this.isLoading = false;
                  this.errMsg = res.message;
                  this.isMessageVisible = true;
                }
              },
              (error) => {
                this.isLoading = false;
                this.isError = true;
                this.errMsg = error?.error?.message;
                this.isMessageVisible = true;
              },
            );
          }
        } else {
          this.isError = true;
          this.errMsg = 'Invalid Validation Code';
          this.isMessageVisible = true;
          this.generateValidationCode();
        }
      } else {
        this.isError = true;
        this.errMsg = 'Password & Confirm Password not same';
        this.isMessageVisible = true;
      }
    } else {
      this.registerData.markAllAsTouched();
      this.isError = true;
      this.errMsg = 'Please fill all required fields';
      this.isMessageVisible = true;
    }
  }
  onAgreeChange(event: any) {
    this.agreeTerms = (event.target as HTMLInputElement).checked;
  }

  refreshValidationCode() {
    this.generateValidationCode();
  }

  generateValidationCode() {
    var val = Math.floor(1000 + Math.random() * 9000);
    this.validationCode = val;
  }
  confirmPass(cp: any) {
    this.confirmPasswd = cp.target.value;
  }
  numberOnly(event: any): any {
    this.isPopupVisible = true;
    var regex = new RegExp('^[a-zA-Z0-9]+$');
    var regex2 = new RegExp(/^[0-9]{1,4}$/);
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode,
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    if (!regex2.test(key)) {
      event.preventDefault();
      return false;
    }
  }
  onlyNumbers(event: any): any {
    var regex = new RegExp('^[a-zA-Z0-9]+$');
    var regex2 = new RegExp(/^[0-9]{1,4}$/);
    var key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode,
    );
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    if (!regex2.test(key)) {
      event.preventDefault();
      return false;
    }
  }
  preventSpace(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\s+/g, '');
  }
  preventSpacePass(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\s+/g, '');
    const formControl = this.registerData.get('passWord');
    if (formControl) {
      formControl.setValue(input.value);
    }
  }
  preventSpecialCharacters(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]*$/;
    const key = event.key;
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
    ];
    if (key === ' ' || (!regex.test(key) && !allowedKeys.includes(key))) {
      event.preventDefault();
    }
  }
  showConfirmpass() {
    this.showConfirm = !this.showConfirm;
  }
  closePopup() {
    this.isMessageVisible = false;
  }
  showpwd() {
    this.showpwrd = !this.showpwrd;
  }
  closePop() {
    this.isPopupVisible = false;
  }

  numberOnlyAndLimit(event: any) {
    let input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value.length > 11) {
      input.value = input.value.slice(0, 11);
    }
    this.registerData.controls['phoneNumber'].setValue(input.value);
  }
  openterm() {
    this.termNcondition = true;
  }
  closeterm() {
    this.termNcondition = false;
  }
}
