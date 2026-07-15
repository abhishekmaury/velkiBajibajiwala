import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-p2p-transfer',
  templateUrl: './p2p-transfer.component.html',
  styleUrls: ['./p2p-transfer.component.css'],
  standalone:true,
  imports:[CommonModule,FormsModule,LoaderComponent],
})
export class P2pTransferComponent implements OnInit {
  userData: any;
  jsonWebdt: any;
  isCopied = false;
  loading = false;
  recipientWalletId = '';
  amount: any = '';
  remark = '';
  showMsg = false;
  betsuccessstatus:any;
  message:any;
  isP2P=false;
  isClassicTheme = false
  constructor(private dataServe: DataHandlerService, private location: Location) {}

  ngOnInit(): void {
    this.dataServe.changeTheme$.subscribe({
      next:(f) => this.isClassicTheme = f,
    })
    const webData = localStorage.getItem('webData');
    if (webData) {
      const parsed = JSON.parse(webData);
      this.jsonWebdt = JSON.parse(parsed.theme);
    }

    const user = localStorage.getItem('userData');
    if (user) {
      this.userData = JSON.parse(user);
    }

    this.dataServe.getUserP2PStatus().subscribe((res: any) => {
      this.isP2P=res.isP2P;
    })
  }

  copyToClipboard(walletId: string): void {
    if (!walletId) return;
    navigator.clipboard.writeText(walletId).then(() => {
      this.isCopied = true;
      setTimeout(() => (this.isCopied = false), 1000);
    });
  }

  clearForm(): void {
    this.recipientWalletId = '';
    this.amount = '';
    this.remark = '';
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.recipientWalletId || !this.amount) {
      this.showMsg = true;
      this.betsuccessstatus = false;
      this.message = 'Please fill in wallet ID and amount';
      return; // stop execution if validation fails
    }

    this.loading = true;


    this.dataServe.TransferP2P(this.recipientWalletId, this.amount, this.remark).subscribe(
        (response: HttpResponse<any>) => {
        this.loading = false;
        if (response.status === 200) {
          this.showMsg = true;
          this.betsuccessstatus = true;
          this.message = response.body?.message || 'Transfer successful';
          this.clearForm();
        } else {
          const res = response.body;
          this.showMsg = true;
          this.betsuccessstatus = false;
          this.message = res?.message || 'Transfer failed';
        }
      },
      (error: any) => {
        this.loading = false;
        this.showMsg = true;
        this.betsuccessstatus = false;
        this.message = error?.error?.message || error.message || 'Something went wrong';
      }
    );
  }



  closeBet(){
    this.showMsg = false;
  }
}
