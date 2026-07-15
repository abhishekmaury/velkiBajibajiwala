import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClassicThemeGuard } from './guard/classic-theme.guard';
import { AuthGuardGuard } from './guard/auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { animation: 'HomePage' } },
  { path: 'login', loadComponent: () => import( './components/login/login.component').then(c => c.LoginComponent), data: { animation: 'LoginPage' } },
  { path: 'sign-up', loadComponent: () => import( './components/sign-up/sign-up.component').then(c => c.SignUpComponent), data: { animation: 'LoginPage' } },
  { path: 'sports/:type/:stype', loadComponent: () => import('./components/sports/sports.component').then(c => c.SportsComponent), data: { animation: 'SportsPage' },canActivate:[ClassicThemeGuard] },
  { path: 'sports/parlay', loadComponent: () => import('./components/parlay-sports/parlay-sports.component').then(c => c.ParlaySportsComponent), data: { animation: 'Parlay' }, canActivate:[ClassicThemeGuard] },
  { path: 'casino/:gamename/:tabname', loadComponent: () => import( './components/casino/casino.component').then(c => c.CasinoComponent), data: { animation: 'CasinoPage' } },
  { path: 'league', loadComponent:() => import('./components/league/league.component').then(c => c.LeagueComponent), data: { animation: 'LeaguePage' } },
  { path: 'annoucement', loadComponent: () => import( './components/anouncement-popup/anouncement-popup.component').then(c => c.AnouncementPopupComponent) },
  { path: 'market/:sportId/:eventId', loadComponent: () => import('./components/market/market.component').then(c => c.MarketComponent), data: { animation: 'MarketPage' }},
  { path: 'toss-parlay', loadComponent: () => import('./components/market-toss-parlay/market-toss-parlay.component').then(c => c.MarketTossParlayComponent), data: { animation: 'MarketTossPage' }},
  { path: 'premium-parlay/:sportId/:eventId', loadComponent: () => import('./components/market-premium-parlay/market-premium-parlay.component').then(c => c.MarketPremiumParlayComponent), data: { animation: 'MarketPremiumPage' }},
  { path: 'mob-match-cupwinner/:sportId/:eventId', loadComponent:() => import( './components/cupwinner/cupwinner.component').then(c =>  c.CupwinnerComponent), data: { animation: 'MarketPage' }},
  { path: 'edit/:fname/:lname/:email', loadComponent: () => import( './components/edit-profile/edit-profile.component').then(c => c.EditProfileComponent), data: { animation: 'EditPage' }, canActivate: [AuthGuardGuard] },
  { path: 'sponser', loadChildren: () => import('./components/sponser/sponsor-routing.module').then(m => m.routes) },
  { path: 'ambassador', loadChildren: () => import('./components/ambassador/ambassador.module').then(m => m.AmbassadorModule) },
  { path: 'info', loadChildren : ()=> import('./components/footer-pages/footer-pages.module').then(c =>(c.FooterPagesModule)) },
  { path: 'menu', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate : [AuthGuardGuard] },
  { path: 'exchange', loadChildren: () => import('./skyexch/skyexch.routers').then(c => (c.exchRoute)), canActivate: [ClassicThemeGuard] },
  { path: "account", loadComponent: () => import('./components/classic/account/account.component').then(m => m.AccountComponent),canActivate: [AuthGuardGuard,ClassicThemeGuard] },
  { path: "change-password", loadComponent: () => import('./components/classic/change-password/change-password.component').then(m => m.ChangePasswordComponent),canActivate: [AuthGuardGuard]  },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
