import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SportsComponent } from './components/sports/sports.component';
import { CasinoComponent } from './components/casino/casino.component';
import { LeagueComponent } from './components/league/league.component';
import { MarketComponent } from './components/market/market.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AuthGuardGuard } from './guard/auth-guard.guard';
import { CupwinnerComponent } from './components/cupwinner/cupwinner.component';
import { ParlaySportsComponent } from './components/parlay-sports/parlay-sports.component';
import { MarketPremiumParlayComponent } from './components/market-premium-parlay/market-premium-parlay.component';
import { MarketTossParlayComponent } from './components/market-toss-parlay/market-toss-parlay.component';
import { AnouncementPopupComponent } from './components/anouncement-popup/anouncement-popup.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { ClassicThemeGuard } from './guard/classic-theme.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { animation: 'HomePage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'sign-up', component: SignUpComponent, data: { animation: 'LoginPage' } },
  { path: 'sports/:type/:stype', component: SportsComponent, data: { animation: 'SportsPage' },canActivate:[ClassicThemeGuard] },
  { path: 'sports/parlay', component: ParlaySportsComponent, data: { animation: 'Parlay' }, canActivate:[ClassicThemeGuard] },
  { path: 'casino/:gamename/:tabname', component: CasinoComponent, data: { animation: 'CasinoPage' } },
  { path: 'league', component: LeagueComponent, data: { animation: 'LeaguePage' } },
  { path: 'annoucement', component: AnouncementPopupComponent },
  { path: 'market/:sportId/:eventId', component: MarketComponent, data: { animation: 'MarketPage' }},
  { path: 'toss-parlay', component: MarketTossParlayComponent, data: { animation: 'MarketTossPage' }},
  { path: 'premium-parlay/:sportId/:eventId', component: MarketPremiumParlayComponent, data: { animation: 'MarketPremiumPage' }},
  { path: 'mob-match-cupwinner/:sportId/:eventId', component: CupwinnerComponent, data: { animation: 'MarketPage' }},
  { path: 'edit/:fname/:lname/:email', component: EditProfileComponent, data: { animation: 'EditPage' }, canActivate: [AuthGuardGuard] },
  { path: 'sponser', loadChildren: () => import('./components/sponser/sponsor-routing.module').then(m => m.routes) },
  { path: 'ambassador', loadChildren: () => import('./components/ambassador/ambassador.module').then(m => m.AmbassadorModule) },
  { path: 'info', loadChildren : ()=> import('./components/footer-pages/footer-pages.module').then(c =>(c.FooterPagesModule)) },
  { path: 'menu', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate : [AuthGuardGuard] },
  { path: 'exchange', loadChildren: () => import('./skyexch/skyexch.routers').then(c => (c.exchRoute)), canActivate: [ClassicThemeGuard] },
  { path: "account", loadComponent: () => import('./components/classic/account/account.component').then(m => m.AccountComponent),canActivate: [AuthGuardGuard] },
  { path: "change-password", loadComponent: () => import('./components/classic/change-password/change-password.component').then(m => m.ChangePasswordComponent),canActivate: [AuthGuardGuard]  },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
