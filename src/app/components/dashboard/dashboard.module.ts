import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardGuard } from 'src/app/guard/auth-guard.guard';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { ActiveLogComponent } from './active-log/active-log.component';
import { BalanceComponent } from './balance/balance.component';
import { BetHistoryComponent } from './bet-history/bet-history.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CurrentBetsComponent } from './current-bets/current-bets.component';
import { P2pTransferLogComponent } from './p2p-transfer-log/p2p-transfer-log.component';
import { P2pTransferComponent } from './p2p-transfer/p2p-transfer.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { LoaderModule } from "../loader/loader.module";
import { UplineWhatsappNumberComponent } from './upline-whatsapp-number/upline-whatsapp-number.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { PaymentTransferLogComponent } from './payment-transfer-log/payment-transfer-log.component';
import { DateRangePickerComponent } from '../date-range-picker/date-range-picker.component';
import { DepositRecieptComponent } from './deposit-reciept/deposit-reciept.component';
import { ReferralComponent } from './referral/referral.component';
import { RebateComponent } from './rebate/rebate.component';
import { SharedModule } from 'src/app/directives/shared.module';
import { LoaderComponent } from '../loader/loader.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: 'balance', loadComponent: () => import('./balance/balance.component').then(c => c.BalanceComponent), data: { animation: 'ProfilePage' } },
      { path: 'current-bets', loadComponent: () => import('./current-bets/current-bets.component').then(c => c.CurrentBetsComponent), data: { animation: 'CurrentPage' } },
      { path: 'activeLog', loadComponent: () => import('./active-log/active-log.component').then(c => c.ActiveLogComponent), data: { animation: 'ActivePage' }, canActivate: [AuthGuardGuard] },
      { path: 'bet-history/:name', loadComponent: () => import('./bet-history/bet-history.component').then(c => c.BetHistoryComponent), data: { animation: 'BetPage' }, canActivate: [AuthGuardGuard] },
      { path: 'account-statement', loadComponent: () => import('./account-statement/account-statement.component').then(c => c.AccountStatementComponent), data: { animation: 'AccountStatement' }, canActivate: [AuthGuardGuard] },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent), data: { animation: 'ProfilePage' }, canActivate: [AuthGuardGuard] },
      { path: 'p2ptransferLog', loadComponent: () => import('./p2p-transfer-log/p2p-transfer-log.component').then(c => c.P2pTransferLogComponent), data: { animation: 'ProfilePage' } },
      { path: 'p2ptransfer', loadComponent: () => import('./p2p-transfer/p2p-transfer.component').then(c => c.P2pTransferComponent), data: { animation: 'ProfilePage' } },
      { path: 'settings', loadComponent: () => import('./settings/settings.component').then(c => c.SettingsComponent), data: { animation: 'ProfilePage' } },
      { path: 'profitLoss/:name', loadComponent: () => import('./profit-loss/profit-loss.component').then(c => c.ProfitLossComponent), data: { animation: 'ProfitPage' }, canActivate: [AuthGuardGuard] },
      { path: 'change-password', loadComponent: () => import('./change-password/change-password.component').then(c => c.ChangePasswordComponent), data: { animation: 'changePage' }, canActivate: [AuthGuardGuard] },
      { path: 'upline-whatsapp-number', loadComponent: () => import('./upline-whatsapp-number/upline-whatsapp-number.component').then(c => c.UplineWhatsappNumberComponent), data: { animation: 'UplineWhatsappNumberPage' } },
      { path: 'deposit', loadComponent: () => import('./deposit/deposit.component').then(c => c.DepositComponent), data: { animation: 'DepositPage' } },
      { path: 'deposit-rec/:data', loadComponent: () => import('./deposit-reciept/deposit-reciept.component').then(c => c.DepositRecieptComponent), data: { animation: 'DepositPage' } },
      { path: 'withdrawal', loadComponent: () => import('./withdrawal/withdrawal.component').then(c => c.WithdrawalComponent), data: { animation: 'WithdrawalPage' } },
      { path: 'payment-transfer-log', loadComponent: () => import('./payment-transfer-log/payment-transfer-log.component').then(c => c.PaymentTransferLogComponent), data: { animation: 'PaymentTransferLogPage' } },
      { path: 'referral', loadComponent: () => import('./referral/referral.component').then(c => c.ReferralComponent), data: { animation: 'ProfilePage' } },
      { path: 'rebate/:name', loadComponent: () => import('./rebate/rebate.component').then(c => c.RebateComponent), data: { animation: 'RebatePage' } }
    ]
  }]

@NgModule({
  declarations: [
    DashboardComponent,
    // CurrentBetsComponent,
    // BetHistoryComponent,
    // ProfitLossComponent,
    // ProfileComponent,
    // P2pTransferComponent,
    // P2pTransferLogComponent,
    // SettingsComponent,
    // BalanceComponent,
    // ChangePasswordComponent,
    // AccountStatementComponent,
    // UplineWhatsappNumberComponent,
    // DepositComponent,
    // WithdrawalComponent,
    // PaymentTransferLogComponent,
    // DateRangePickerComponent,
    // DepositRecieptComponent,
    // ReferralComponent,
    // RebateComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    LoaderModule,

    // Standalone
    ActiveLogComponent,
],
exports : [
  ReactiveFormsModule
]
})
export class DashboardModule { }
