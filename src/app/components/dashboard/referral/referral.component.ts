import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css'],
  standalone:true,
  imports:[CommonModule],
})
export class ReferralComponent {
  activeTab: string = 'all';
  userData: any;
  referralDetails: any;
  refUser: any;
  currentPL: any;
  isCopied: boolean = false;
  totalPL: number = 0.0;
  myCommPer: number = 0;
  commEar: number = 0;
  isClassicTheme: boolean = false;

  setTab(tab: string) {
    this.activeTab = tab;
  }
  constructor(private dataserve: DataHandlerService) { }

  ngOnInit() {
     this.dataserve.changeTheme$.subscribe({
      next:(f) => this.isClassicTheme = f,
    })
    let data = localStorage.getItem('userData');
    if (data) {
      this.userData = JSON.parse(data)
    }

    this.refDetails();
    this.refUsers();
  }

  refDetails() {
    this.dataserve.getReferralDetails().subscribe({
      next: (res: any) => {
        this.referralDetails = res;
        this.myCommPer = this.referralDetails?.refComm;
        this.currentRefPL();
      },
      error: (err) => {
        console.error("Referral Details Error:", err);
      }
    });
  }

  refUsers() {
    this.dataserve.getUserRefUsers().subscribe({
      next: (res: any) => {
        this.refUser = res;
      },
      error: (err) => {
        console.error("Ref Users Error:", err);
      }
    });
  }

  currentRefPL() {
    this.dataserve.getUserCurrentRefPL().subscribe({
      next: (res: any) => {
        this.currentPL = res;
        this.totalPL = res.reduce((sum: number, item: any) => sum + item.pnl, 0);
        if(this.totalPL<0.0){
          this.totalPL = 0.0 - this.totalPL;
          this.commEar = (this.myCommPer / 100) * this.totalPL;
        }
      },
      error: (err) => {
        console.error("Current P/L Error:", err);
      }
    });
  }

  copyToClipboard(refCode: string): void {
    const url = refCode;
    navigator.clipboard.writeText(url).then(() => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

}
