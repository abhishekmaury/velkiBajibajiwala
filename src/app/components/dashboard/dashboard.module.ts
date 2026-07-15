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
      { path: 'balance', component: BalanceComponent, data: { animation: 'ProfilePage' } },
      { path: 'current-bets', component: CurrentBetsComponent, data: { animation: 'CurrentPage' } },
      { path: 'activeLog', component: ActiveLogComponent, data: { animation: 'ActivePage' }, canActivate: [AuthGuardGuard] },
      { path: 'bet-history/:name', component: BetHistoryComponent, data: { animation: 'BetPage' }, canActivate: [AuthGuardGuard] },
      { path: 'account-statement', component: AccountStatementComponent, data: { animation: 'AccountStatement' }, canActivate: [AuthGuardGuard] },
      { path: 'profile', component: ProfileComponent, data: { animation: 'ProfilePage' }, canActivate: [AuthGuardGuard] },
      { path: 'p2ptransferLog', component: P2pTransferLogComponent, data: { animation: 'ProfilePage' } },
      { path: 'p2ptransfer', component: P2pTransferComponent, data: { animation: 'ProfilePage' } },
      { path: 'settings', component: SettingsComponent, data: { animation: 'ProfilePage' } },
      { path: 'profitLoss/:name', component: ProfitLossComponent, data: { animation: 'ProfitPage' }, canActivate: [AuthGuardGuard] },
      { path: 'change-password', component: ChangePasswordComponent, data: { animation: 'changePage' }, canActivate: [AuthGuardGuard] },
      { path: 'upline-whatsapp-number', component: UplineWhatsappNumberComponent, data: { animation: 'UplineWhatsappNumberPage' } },
      { path: 'deposit', component: DepositComponent, data: { animation: 'DepositPage' } },
      { path: 'deposit-rec/:data', component: DepositRecieptComponent, data: { animation: 'DepositPage' } },
      { path: 'withdrawal', component: WithdrawalComponent, data: { animation: 'WithdrawalPage' } },
      { path: 'payment-transfer-log', component: PaymentTransferLogComponent, data: { animation: 'PaymentTransferLogPage' } },
      { path: 'referral', component: ReferralComponent, data: { animation: 'ProfilePage' } },
      { path: 'rebate/:name', component: RebateComponent, data: { animation: 'RebatePage' } }
    ]
  }]

@NgModule({
  declarations: [
    DashboardComponent,
    CurrentBetsComponent,
    BetHistoryComponent,
    ProfitLossComponent,
    ProfileComponent,
    P2pTransferComponent,
    P2pTransferLogComponent,
    SettingsComponent,
    BalanceComponent,
    ChangePasswordComponent,
    AccountStatementComponent,
    // UplineWhatsappNumberComponent,
    DepositComponent,
    WithdrawalComponent,
    PaymentTransferLogComponent,
    DateRangePickerComponent,
    DepositRecieptComponent,
    ReferralComponent,
    RebateComponent
  ],
  imports: [
    LoaderComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
