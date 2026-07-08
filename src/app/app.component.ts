import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { HandlerService } from './services/handler.service';
import { DataHandlerService } from './services/datahandler.service';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { Title } from '@angular/platform-browser';
import DisableDevtool from 'disable-devtool';
import { IntercomService } from './services/intercom.service';

// DisableDevtool({
//   ondevtoolopen(type, next){
//     next();
//   }
// });

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%',
            opacity: 0,
          }),
        ], { optional: true }),
        query(':leave', [
          animate('350ms ease-in-out', style({ opacity: 0 })),
        ], { optional: true }),
        query(':enter', [
          animate('350ms ease-in-out', style({ opacity: 1 })),
        ], { optional: true }),
      ]),
    ]),
  ],
})

export class AppComponent implements OnInit {
  title = 'krikbash365';
  profile = false;
  hideCasino = false;
  isSearch = false;
  launchUrl: any;
  gameslist: any;
  isOpen = false;
  isRegion = false;
  webdata: any;
  favicon: any;
  domain: any;
  userData: any;
  loading = true;
  betSuccess: any;
  activeliab: any;
  openAlertPop = false
  loggedIn = false;
  errmesg = ''
  count: any;
  showMybet = false;
  position = { top: window.innerHeight - 80, left: window.innerWidth - 80 }; // Start position
  position1 = { top: window.innerHeight - 80, left: window.innerWidth - 80 }; // Start position
  showWidget = false;
  hideAnnounce = false;
  jsonWeblinksdt: any;
  webLinks: any;
  activeIndex: any
  isRefreshing = false;

  showHeader: boolean = true;
  showFooter: boolean = true;
  classicTheme = true;
  constructor(private titleService: Title, private route: Router, private popupService: HandlerService,
              private dataServe: DataHandlerService, private router: Router,private intercom: IntercomService) {
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/deposit-rec')) {
          this.showHeader = false;
          this.showFooter = false;
        } else {
          this.showHeader = true;
          this.showFooter = true;
        }
      }
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  hideMarqueeHeader(): boolean {
    const currentUrl = this.route.url;
    if (currentUrl.startsWith('/edit')) {
      return false;
    }
    const hiddenRoutes = ['/login', '/edit', '/change-password', '/annoucement', '/edit/user1/Test/user1@gmail.com', '/sign-up'];
    return !hiddenRoutes.includes(this.route.url)
  }

  hidefooter(): boolean {
    const currentUrl = this.route.url;
    if (currentUrl.startsWith('/edit')) {
      return false;
    }
    const hiddenRoutes = ['/home', '/classichome', '/edit', '/menu/upline-whatsapp-number', '/menu/change-password', '/login', '/menu/current-bets', '/menu/balance', '/menu/activeLog', '/menu/profile', '/menu/account-statement', '/change-password', '/toss-parlay', '/annoucement', '/menu/settings', '/menu/deposit', '/menu/withdrawal', '/menu/p2ptransfer', '/menu/p2ptransferLog', '/edit/user1/Test/user1@gmail.com', '/sign-up'];
    const currentRoute = this.route.url;
    const isBetHistoryRoute = currentRoute.startsWith('/bet-history/') && currentRoute.split('/').length === 3;
    const isMarketRoute = currentRoute.startsWith('/market/');
    const isMarketPremiumRoute = currentRoute.startsWith('/premium-parlay/');
    const isCupwinner = currentRoute.startsWith('/mob-match-cupwinner/');
    const isProfitRoute = currentRoute.startsWith('/profitLoss/') && currentRoute.split('/').length === 3;
    return !hiddenRoutes.includes(this.route.url) && !isBetHistoryRoute && !isProfitRoute && !isMarketRoute && !isCupwinner && !isMarketPremiumRoute;
  }

  hidefoot(): boolean {
    const hiddenRoutes = ['/info/privacy-policy', '/info/term-condition', '/info/rule-regulation', '/info/KYC', '/info/responsible-gaming', '/menu/payment-transfer-log'];
    const currentRoute = this.route.url;
    return !hiddenRoutes.includes(this.route.url)
  }

  ngOnInit(): void {
    let data = localStorage.getItem('userData');
    if (data) {
      this.userData = JSON.parse(data)
      let dataa = this.dataServe.decodejwt(this.userData?.password)
      const date = new Date(dataa.exp * 1000);
      let convertedDate = this.dataServe.formatDate(date);
      let expTkn = new Date(convertedDate)
      let checkExpToken = expTkn.getTime()
      this.dataServe.init(checkExpToken)
    }

    const anonymous_id = crypto.randomUUID();

    this.dataServe.getIntercomData().subscribe((res: any) => {
        this.intercom.boot(res?.user,res?.user_hash,anonymous_id);
      })

    let token = localStorage.getItem('token')
    if (token) {
      this.loggedIn = true
      this.dataServe.getActiveLiabUserWise().subscribe((res: any) => {
        this.count = res.length
      })
    } else {
      this.loggedIn = false
    }
    this.dataServe.betSuccessMsg.subscribe((res: any) => {
      if (res) {
        this.dataServe.getActiveLiabUserWise().subscribe((res: any) => {
          this.count = res.length
        })
      }
    })
    // halfbaji

    let domain = 'wfh247.vip'
    this.dataServe.getWebsiteData1(domain).subscribe((res: any) => {
      localStorage.setItem("webData1", JSON.stringify(res?.data));
      // this.isSekeleton = false
      this.dataServe.getWebData(res?.data);
      // let favicon = res?.data?.favicon;
      // this.chaticon = res?.data?.chatIcon;
      // this.dataserve.updateFavicon(favicon)
      // this.themeData = res?.data?.theme;
      // this.headData = res?.data?.headData;
      // this.headerLogo = res?.data.logo;
      // this.bodyData = res?.data?.bodyData;
      // this.head?.applyHeadHTML(this.headData);
      // this.head?.prependToBodyHTML(this.bodyData);

      // const titleFromAPI = this.domainName;
      // if (titleFromAPI) {
      //   this.setTitle(titleFromAPI);
      // }
    }, (error) => {
      // this.isSekeleton = false
    })

    let data1 = localStorage.getItem('webData');
    if (data1 == null) {
      this.dataServe.getWebsiteData().subscribe((res) => {
        localStorage.setItem("webData", JSON.stringify(res))
        let d1 = res;
        this.webdata = d1;
        this.favicon = this.webdata?.imageData?.headers?.[0]?.favicon;
        this.jsonWeblinksdt = JSON.parse(this.webdata.links)

        let dt = this.webdata?.imageData?.domain;
        this.domain = this.getdomain(dt)

        const titleFromAPI = this.domain;
        if (titleFromAPI) {
          this.setTitle(titleFromAPI);
        }

        this.dataServe.updateFavicon(this.favicon);
        this.loading = false;
      })
    } else {
      let d1 = JSON.parse(data1);
      this.webdata = d1;
      this.favicon = this.webdata?.imageData?.headers?.[0]?.favicon;
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)

      let dt = this.webdata?.imageData?.domain;
      this.domain = this.getdomain(dt)

      const titleFromAPI = this.domain;
      if (titleFromAPI) {
        this.setTitle(titleFromAPI.toUpperCase());
      }

      this.dataServe.updateFavicon(this.favicon);
      this.loading = false;
    }

    this.popupService.popupBetstate$.subscribe(state => {
      this.isOpen = state;
    });
    this.popupService.openEditState$.subscribe(res => {
      this.profile = res
    })
    this.popupService.openRegionState$.subscribe(res => {
      this.isRegion = res
    })
    this.popupService.openSearchState$.subscribe((res: any) => {
      this.gameslist = res;
      if (res?.length > 0) {
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    })

    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        this.hideCasino = (event.url.includes('/market')) || (event.url.includes('/login')) || (event.url.includes('/mob-match-cupwinner')) || (event.url.includes('/change-password')) || (event.url.includes('/menu')) || (event.url.includes('/bet-history')) || (event.url.includes('/annoucement')) || (event.url.includes('/sign-up'))
        this.showWidget = (event.url.includes('/market'))
        this.hideAnnounce = (event.url.includes('/annoucement'))
        let home = (event.url.includes('/home'))
        if (home || this.showWidget) {
          this.showMybet = true;
          this.isSearch = false;
          this.position = { top: window.innerHeight - 130, left: 10 }; // Start position
          this.position1 = { top: window.innerHeight - 120, left: window.innerWidth - 65 }; // Start position
        } else {
          this.showMybet = false;
          // this.position = { top: window.innerHeight - 140,  left: window.innerWidth - 80 }; // Start position
          this.position = { top: window.innerHeight - 140, left: 10 }; // Start position
          this.position1 = { top: window.innerHeight - 180, left: window.innerWidth - 65 }; // Start position

        }
      }
    });
    this.popupService.alertState$.subscribe((res: any) => {
      this.openAlertPop = res?.[0]
      this.errmesg = res?.[1]
      setTimeout(() => {
        this.openAlertPop = false;
        this.errmesg = ''
      }, 3000)
    })
    this.dataServe.sendSportidToWidget.subscribe((re: any) => {
      this.showWidget = re;
    })

    this.dataServe.emitRouteActive.subscribe((res: any) => {
      this.activeIndex = res;
    })
    this.themeToggleFun();
  }


  themeToggleFun() {

    this.dataServe.changeTheme$.subscribe((res: any) => {
      this.classicTheme = res;
      
      if (this.classicTheme == true) {
        this.router.navigate(['/classichome'])
      } else {
        this.router.navigate(['/home'])
      }
    })
    let theme = localStorage.getItem('clssaicTheme');
    const classic = document.getElementById('classic-style') as HTMLLinkElement;
    const modern = document.getElementById('newer-style') as HTMLLinkElement;

    classic?.remove();
    modern?.remove();
    const link = document.createElement('link');
    link.rel = 'stylesheet';

    if (theme == 'true') {
      this.classicTheme = true;
      link.id = 'classic-style';
      link.href = './assets/css/halfbaji.css?v=1.10';
    } else {
      this.classicTheme = false;
      link.id = 'newer-style';
      link.href = './assets/css/main.css?v=1.10';
    }
    document.head.appendChild(link);
  }
  ngAfterViewInit() {
    this.removeIntercomLauncher();
  }

  removeIntercomLauncher() {
  const interval = setInterval(() => {
    const iframe = document.querySelector(
      'iframe[name="intercom-launcher-frame"]'
    );
    const launcher = document.querySelector('.intercom-launcher');

    if (iframe) iframe.remove();
    if (launcher) launcher.remove();
  }, 500);

  // stop after 10 sec
  setTimeout(() => clearInterval(interval), 10000);
}

  closePopup() {
    this.popupService.closeProfile();
  }

  openPopup() {
    this.popupService.openPopup();
  }
  private initialPosition = { top: 0, left: 0 };
  private startTouchPosition = { x: 0, y: 0 };
  private isDragging = false;

  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.startTouchPosition = { x: touch.clientX, y: touch.clientY };
    this.initialPosition = { ...this.position };
    this.isDragging = false;
  }

  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.startTouchPosition.x;
    const deltaY = touch.clientY - this.startTouchPosition.y;
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      this.position.top = Math.max(0, this.initialPosition.top + deltaY);
      this.position.left = Math.max(0, this.initialPosition.left + deltaX);
      this.isDragging = true;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.isDragging) {
      //this.goToFrmLogo();
    }
    this.isDragging = false;
  }

  goToFrmLogo() {
    if (this.isRefreshing) return;
      this.isRefreshing = true;
    let token = localStorage.getItem('token');
    if (token) {
      this.dataServe.LaunchAWCLobby().subscribe((res: any) => {
        if (res.type !== 'error') {
          this.launchUrl = res.launchUrl;
          window.location.href = this.launchUrl;
        }
        this.isRefreshing = false;
      }, () => {
        this.isRefreshing = false;
      });
    } else {
      this.route.navigate(['/login'])
    }
  }

  setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }

  getdomain(data: string) {
    const url = new URL(data);
    const hostnameParts = url.hostname.split('.');
    const domain = hostnameParts[0];
    return domain;
  }

  openIntercom() {
    if (window.Intercom) {
      window.Intercom('show');
    }
  }
}
