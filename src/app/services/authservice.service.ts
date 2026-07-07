import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject, Subject, catchError, interval, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DataHandlerService } from './datahandler.service';
import { response } from 'express';
import { IntercomService } from './intercom.service';


@Injectable({
  providedIn: 'root'
})
export class AuthserviceService implements OnInit,OnDestroy {
  //baseUrl = `https://ag.9xbet9.live/api-V2`;
  baseUrl = `https://ag.${window.location.hostname}/api-V2`;
  secretKey = environment.secretKey;
  sendLoggedData: BehaviorSubject<any> = new BehaviorSubject('abc')
  sendLoggedData1 = new Subject<any>()
  sendLoggedData2 = new Subject<any>()
  sendLoggedData3 = new Subject<any>()
  sendPrivacy = new Subject<any>()

  private countListenter = new Subject<any>();
  usersData: any;
  loginFlag: any;
  eventData: any;
  interval$ = interval(5000);
  checkInterval: any
  intervalSubscription: any;
  loggedIn = false
  domain: any;

  constructor(private http: HttpClient, private router: Router, private dataserve: DataHandlerService, private intercom: IntercomService) {}

  ngOnInit(): void {
  }

  getdomain(){
    let dname = window.location.hostname;
    return dname;
  }

  validateLogin(obj: any) {
    return this.http.post(`${this.baseUrl}/validateLogin`, obj).subscribe({
      next: (res: any) => {
        if (res.type !== 'error') {
          this.router.navigate(['/myAccount/home'])
          localStorage.setItem('token', res.password)
          localStorage.setItem('placebetcheck', 'false')
          localStorage.setItem('loginTime', new Date().getTime().toString());
          this.sendLoggedData.next(res)
          localStorage.setItem('userData', JSON.stringify(res))
          let dataa = this.dataserve.decodejwt(res?.password)
          const date = new Date(dataa.exp * 1000);
          let convertedDate = this.formatDate(date);
          let expTkn = new Date(convertedDate)
          let checkExpToken = expTkn.getTime()
          this.dataserve.init(checkExpToken)
          window.location.reload()
        } else {
          this.sendLoggedData2.next(res.message)
        }
      }, error: (err: any) => {
        if (err?.error?.message) {
          this.sendLoggedData2.next(err.error.message);
        } else {
          this.sendLoggedData2.next('Something went wrong. Please try again.');
        }
      }
    });
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  isLoggedIn() {
    this.dataserve.isLoggedIn().subscribe((re: any) => {
      if(re?.type === 'error') {
        this.logout()
        this.sendLoggedData1.next(false)
        window.location.reload()
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData')
    this.intercom.shutdown();
    window.location.reload()
    this.loggedIn = false;
    this.sendLoggedData1.next(this.loggedIn)
    this.router.navigate(['/home']);
  }
  getData(data : any){
    this.sendPrivacy.next(data)
  }
   signUpUser(obj: any) {
    return this.http.post(`${this.baseUrl}/validateSignUp`,obj
    ).pipe(
      catchError((error) => {
        return throwError(error);
      }))
  }




}
