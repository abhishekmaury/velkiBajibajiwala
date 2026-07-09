import { Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-classic-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class ClassicHeaderComponent implements OnInit {
  @Input('countData') countData : any;
  menu = false
  isMarketRoute = false;
  userName: any;
  // currentBets: any;
  gameCount: any;
  loginData: any;
  errMsg: string = '';
  loginResData: any;
  balInfo: any;
  expoInfo: any;
  oneClick: boolean = false;
  showpwrd: boolean = false;
  loggedIn: boolean = false;
  validationCode: any;
  checkInterval: any;
  isLogin = false
  intervalSubscription: any;
  refreshBtn = false
  popup: boolean = false;
  showHeader: boolean = true;
  launchUrl: any;
  openTv = false;
  accPopoup = false;
  hideDeskHeader = true;
  webdata: any;
  img: any;
  yellow = 'yellow'
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  isMobile: boolean = false;
  isRefreshing = false
  isToggled = false
  themeData:any;
  footerLinkss:any;
  spinner = false;


  constructor(
    private dataServe: DataHandlerService,
    private authService: AuthserviceService,
    private router: Router,
    private Trans:TranslocoService,
  ) { }

  ngOnInit(): void {
    this.isToggled = this.dataServe.isClassicTheme();
    this.isMarketRoute =
    this.router.url.includes('/market') ||
    this.router.url.includes('/mob-match-cupwinner') ||
    this.router.url.includes('/premium-parlay');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMarketRoute = event.url.includes('/market') || event.url.includes('/mob-match-cupwinner') || event.url.includes('/premium-parlay');
        this.menu = false
      }
    });

    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.img = this.webdata?.imageData?.headers?.[0]?.logo?.replace(' ', '%20')
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing=this.jsonWeblinksdt?.validShowing;
    }

    let data = localStorage.getItem('userData');
    if (data) {
      this.loginResData = JSON.parse(data);
      this.balInfo = this.loginResData.myBalance;
      this.expoInfo = this.loginResData.exposureLimit;
      this.userName = this.loginResData.userid;
    }
    this.dataServe.betSuccessMsg.subscribe((res) => {
      if (res[0] == true) {
        this.upDateBalance()
      }
    })

    this.authService.sendLoggedData2.subscribe((re: any) => {
      this.errMsg = re
    })

    const validToken = localStorage.getItem('token');
    if (validToken !== null) {
      this.loggedIn = true;
      //  this.dataServe.getActiveLiabUserWise().subscribe((res:a ny)=>{
      //   this.currentBets = res?.length || 0
      //  })
    } else {
      this.loggedIn = false;
    }
  }
  singupLink(){
    window.open(this.jsonWeblinksdt?.signupContent, '_blank');
  }

  openMenu() {
    this.menu = !this.menu
  }
  close() {
    this.menu = false
  }

  goBack(): void {
    window.history.back();
  }

  showpwd() {
    this.showpwrd = !this.showpwrd
  }

  ngAfterViewInit() {
    const validToken = localStorage.getItem('token');
    if (validToken !== null) {
      this.upDateBalance();
    }
  }


  logout() {
    this.authService.sendLoggedData1.subscribe((res: any) => {
      this.loggedIn = res;
    })

    this.authService.logout()
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


  numberOnly(event: any):any {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var regex2 = new RegExp(/^[0-9]{1,4}$/);
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    if (!regex2.test(key)) {
      event.preventDefault();
      return false;
    }
  }

  openSignup(url: string | undefined) {
    if (url) window.location.href = url;
  }

  toggleSwitch() {
    this.isToggled = !this.isToggled;
    this.dataServe.getThemeFlag(this.isToggled)
    localStorage.setItem('clssaicTheme', JSON.stringify(this.isToggled))
    const classic = document.getElementById('classic-style') as HTMLLinkElement;
    const modern = document.getElementById('newer-style') as HTMLLinkElement;

    classic?.remove();
    modern?.remove();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    if (this.isToggled) {
      link.id = 'classic-style';
      link.href = './assets/css/halfbaji.css?v=1.10';
    } else {
      link.id = 'newer-style';
      link.href = './assets/css/main.css?v=1.10';
    }

    document.head.appendChild(link);
    this.openSidebar();
  }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!(target).closest('.asidebar')) {
      this.asideBar = false;
      this.isSidebarOpen = false;
    }
  }


  navigateToGames(gmnm: any, tab: any) {
    this.isSidebarOpen = false;
    this.router.navigate([`/games/${gmnm}/${tab}`])
  }
  closelang() {
    this.showlangpop = false;
  }
  selectLang() {
    this.showlangpop = true;
  }
  openLoginPop() {
    this.loginPopup = true;
  }

  openRegesterPop() {
    this.regesterPopup = true;
  }

  openLangPop() {
    this.changeLang = true;
  }


  checkReferral() {
    this.isSidebarOpen = false;
    let lsData = localStorage.getItem('userData');
    if (lsData) {
      this.router.navigate(['/referral'])
    } else {
      this.loginPopup = true;
    }
  }
  checkReferralMob() {
    this.isSidebarOpen = false;
    let lsData = localStorage.getItem('userData');
    if (lsData) {
      this.router.navigate(['/referral'])
    } else {
      this.router.navigate(['/referral'])
    }
  }

  loginPopup = false;
  regesterPopup = false;
  changeLang = false;

  hidePopup() {
    this.loginPopup = false;
    this.regesterPopup = false;
    this.changeLang = false;
  }

  asideBar =false;
  openAsideBar() {
    this.asideBar = true;
  }

  closeAsideBar() {
    this.asideBar = false;
  }






  casinomenu =true;
  slotmenu =true;
  tablemenu = true;
  fishingmenu = true;
  lotterymenu = false;
  activeMenu: string = '';
  isSidebarOpen = false;
  openSidebar() {
    this.activeMenu = '';
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  lang:any;
  showlangpop: boolean = false;
  showErrPopup: boolean = false;

  setActiveLang(lang: string) {
    this.Trans.setActiveLang(lang)
    localStorage.setItem('language', lang)
    this.lang = lang;
    this.isSidebarOpen = false;
    this.showlangpop = false
  }

  openAffiliate() {
    window.open('/assets/affiliate/index.html', '_blank');
  }

  // TODO
  sportsmenu = true;
  openforum() {}

  menuTabs(menu: string): void {
    this.activeMenu = menu;
  }


  navigateTochatbot() {}
  navigateToExch() {
    // this.isSidebarOpen = false;
    // let token = localStorage.getItem('token')
    // if (token) {
    //   this.router.navigate(['/exchange/mob-sport/4'])
    // } else {
    //   this.router.navigate(['/login'])
    // }
  }


  opensabagamesmob(link: any) {
        // this.dataServe.LaunchSabagms(this.data, link).subscribe((res: any) => {
        //     if (res.gameUrl == '') {
        //       this.showErrPopup = true;
        //       this.errMsg = 'URL not provided in response data.'
        //     } else if (res.type !== 'error') {
        //       this.launchUrl = res.gameUrl;
        //       window.location.href = this.launchUrl;
        //     } else {
        //       this.showErrPopup = true;
        //       this.errMsg = res.message
        //     }
        //   }, (error) => {
        //     // if(error.status==200){
        //     // let gms = this.dataserve.decryptData(error.error.text);
        //     // console.log(error)
        //     // }
        //   })
  }

}

