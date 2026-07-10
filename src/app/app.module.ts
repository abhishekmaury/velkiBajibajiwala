import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptorInterceptor } from './authInterceptor.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { register } from 'swiper/element/bundle';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { SportsComponent } from './components/sports/sports.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { CasinoComponent } from './components/casino/casino.component';
import { MarketComponent } from './components/market/market.component';
import { LeagueComponent } from './components/league/league.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { MyBetsComponent } from './components/my-bets/my-bets.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { RegionComponent } from './components/region/region.component';
import { SearchComponent } from './components/search/search.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthserviceService } from './services/authservice.service';
import { MarqueeComponent } from './components/marquee/marquee.component';
import { BetPlaceComponent } from './components/bet-place/bet-place.component';
import { FooterPagesModule } from './components/footer-pages/footer-pages.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { PipeModule } from './pipes/sharePipe.module';
import { LoaderModule } from "./components/loader/loader.module";
import { CupwinnerComponent } from './components/cupwinner/cupwinner.component';
import { PlaceBetCupwinnerComponent } from './components/cupwinner/place-bet-cupwinner/place-bet-cupwinner.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ParlaySportsComponent } from './components/parlay-sports/parlay-sports.component';
import { MarketPremiumParlayComponent } from './components/market-premium-parlay/market-premium-parlay.component';
import { MarketTossParlayComponent } from './components/market-toss-parlay/market-toss-parlay.component';
import { BetPlaceParlayComponent } from './components/bet-place-parlay/bet-place-parlay.component';
import { PopupComponent } from './components/popup/popup.component';
import { MarketWidgetComponent } from './components/market-widget/market-widget.component';
import { AnouncementPopupComponent } from './components/anouncement-popup/anouncement-popup.component';
import { DatePipe } from '@angular/common';
import { SearchCasinoComponent } from './components/search-casino/search-casino.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { StakeSettingsComponent } from './components/stake-settings/stake-settings.component';
import { GetSocketUrlService } from './services/get-socket-url.service';
import { SharedModule } from './directives/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ClassicHeaderComponent } from './components/classic/header/header.component';
import { TranslocoRootModule } from './transloco-root.module';
import { HomeComponent } from './components/home/home.component';
import { HomeOriginalComponent } from './components/original/home/home-original.component';
import { HomeClassicComponent } from './components/classic/home/home-classic.component';

register();
export function initApp(configService: GetSocketUrlService) {
  return () => configService.getSocketUrl();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    ClassicHeaderComponent,
    SportsComponent,
    FooterComponent,
    CasinoComponent,
    MarketComponent,
    LeagueComponent,
    MyBetsComponent,
    EditProfileComponent,
    RegionComponent,
    SearchComponent,
    MarqueeComponent,
    BetPlaceComponent,
    CupwinnerComponent,
    PlaceBetCupwinnerComponent,
    ParlaySportsComponent,
    MarketPremiumParlayComponent,
    MarketTossParlayComponent,
    BetPlaceParlayComponent,
    PopupComponent,
    MarketWidgetComponent,
    AnouncementPopupComponent,
    SearchCasinoComponent,
    SignUpComponent,
    StakeSettingsComponent,
    HomeComponent,
    HomeOriginalComponent,
    HomeClassicComponent,
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    AppRoutingModule,
    HttpClientModule,
    PipeModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardModule,
    FooterPagesModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    }),
    LoaderModule,
    CarouselModule,
    TranslocoRootModule,
    MainFooterComponent,

  ],
  exports : [TranslocoRootModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [GetSocketUrlService],
      multi: true
    },
    AuthserviceService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
