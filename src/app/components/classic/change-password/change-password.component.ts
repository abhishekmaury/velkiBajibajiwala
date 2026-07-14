import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { FooterComponent } from "src/app/skyexch/footer/footer.component";
import { Location } from '@angular/common';
import { SharedModule } from 'src/app/directives/shared.module';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent,ReactiveFormsModule,SharedModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  userData: any;
  changePass: any;
  myProf = false;
  passResponse: any;
  errMsg: string = ''
  showMsg = false;
  showOld: boolean = false;
  showpwrd: boolean = false
  showConfirm: boolean = false;
  isFadingOut = false;
  webdata: any;
  backgroundImg = '';
  innrrImg: any = '';

  constructor(private location: Location, private dataServe: DataHandlerService, private router: Router) { }

  ngOnInit(): void {

    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.backgroundImg = this.webdata?.imageData?.headers?.[0]?.mobile_login_image;
      this.innrrImg = this.webdata?.imageData?.headers?.[0]?.web_login_image;
    }

    let data = localStorage.getItem('userData');
    if (data) {
      this.userData = JSON.parse(data)
    }
    this.changePass = new FormGroup({
      tran_code: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmnewPassword: new FormControl('', [Validators.required])
    })
  }
  get tran_code() {
    return this.changePass.get("tran_code")
  }
  get newPassword() {
    return this.changePass.get("newPassword")
  }
  get confirmnewPassword() {
    return this.changePass.get("confirmnewPassword")
  }
  submitted = false
  changePassword() {
    // if (this.changePass.valid) {
    //   this.dataServe.changeYourPassword(this.changePass.value).subscribe((res: any) => {
    //     this.passResponse = res;
    //     if (res.type !== 'error') {
    //       this.showMsg = true;
    //       this.errMsg = res.message;
    //       this.userData.ispasswordChanged = true;
    //       localStorage.setItem('userData', JSON.stringify(this.userData))
    //       this.router.navigate(['/home'])
    //     } else {
    //       this.showMsg = false;
    //       this.errMsg = res.message
    //     }
    //   })
    //   this.changePass.reset();
    //   setTimeout(() => {
    //     this.errMsg = ''
    //   }, 5000);
    // } else {
    //   this.errMsg = "All fields are required"
    //   setTimeout(() => {
    //     this.errMsg = ''
    //   }, 5000);

    // }
    this.submitted = true
    if (this.changePass.value.newPassword?.trim()) {
      if (this.changePass.value.confirmnewPassword?.trim()) {
        if (this.changePass.value.tran_code?.trim()) {
          this.dataServe.changeYourPassword(this.changePass.value).subscribe((res: any) => {
            this.passResponse = res;
            if (res.type !== 'error') {
              this.showMsg = true;
              this.errMsg = res.message;
              this.userData.ispasswordChanged = true;
              localStorage.setItem('userData', JSON.stringify(this.userData))
              this.router.navigate(['/home'])
            } else {
              this.showMsg = false;
              this.errMsg = res.message
            }
          })
        } else {
          this.errMsg = "Your Password Field can not be empty"
        }
      }
      else {
        this.errMsg = "New Password Confirm Field can not be empty"
      }
    } else {
      this.errMsg = " New Password Field can not be empty"
    }
    console.log(this.errMsg);
    

  }

  goBack(): void {
    this.isFadingOut = true;
    setTimeout(() => {
      this.location.back();
    }, 300);
  }
  showOldpwd() {
    this.showOld = !this.showOld
  }
  showpwd() {
    this.showpwrd = !this.showpwrd
  }
  showConfirmpwd() {
    this.showConfirm = !this.showConfirm
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    this.router.navigate(['/login'])
  }


}
