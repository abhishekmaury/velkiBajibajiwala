import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, TranslocoModule, RouterLink],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  userName: any;
  loginResData: any;
  balInfo: any;
  expoInfo: any;
  showamount = true;
  isRefreshing = false
  refreshBtn = false
  constructor(
    private dataServe: DataHandlerService) { }

  ngOnInit(): void {
    let data = localStorage.getItem('userData');
    if (data) {
      this.loginResData = JSON.parse(data);
      this.balInfo = this.loginResData.myBalance;
      this.expoInfo = this.loginResData.exposureLimit;
      this.userName = this.loginResData.userid;
    }
  }
  showpwd() {
    this.showamount = !this.showamount
  }
  upDateBalance() {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    this.dataServe.getBalInfo().subscribe((res: any) => {
      this.balInfo = res.balance;
      this.expoInfo = res.expo;
      this.refreshBtn = true;
      setTimeout(() => {
        this.refreshBtn = false;
        this.isRefreshing = false;
      }, 500);
    }, () => {
      this.isRefreshing = false;
    });
  }

}
