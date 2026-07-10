import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core'; import { Router, RouterLink } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthserviceService } from '../../services/authservice.service';
import { FingerprintService } from '../../services/fingerprint.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslocoModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @Input() downloadapp: boolean = true;
  @Output() downloadBarClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  loginPopup = false;
  regesterPopup = false;
  changeLang = false;
  asideBar = false;
  beforeLogin = true;
  afterLogin = false;
  loggedData: any;
  username: any;
  userBalance: any;
  currency: any;
  validateapi: any;
  updBal = true;
  spinner = false;
  css: any;
  intervalSubscription: any;
  headerLogo: any;
  themeData: any;
  activeMenu: string = '';
  sportsmenu = true;
  casinomenu = true;
  slotmenu = true;
  tablemenu = true;
  fishingmenu = true;
  lotterymenu = true;
  isSidebarOpen = false;
  lang: any;
  isB2c = true;
  isPromotion = true;
  isReferral = true;
  isVip = true;
  country: any;
  agentType = 0;
  exposure = 0;

  matchWallet: any;
  checkSports: any;
  selectedWallet: any;
  deviceId: string = '';
  walletsList: any;
  customOptions: OwlOptions = {
    loop: true,
    center: false,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,

    responsive: {
      0: {
        items: 2
      },
      300: {
        items: 2
      },
      700: {
        items: 3
      },
      1000: {
        items: 3
      }
    }
  }
  footerLinkss: any;
  showlangpop: boolean = false;
  showErrPopup: boolean = false;
  errMsg: any;
  launchUrl: any;
  data: any;
  fingerprintHash = '';
  currentUrl = '';
  referralUrl = '';
  fingerData: any;
  disabled = false

  constructor(private authServe: AuthserviceService, private dataserve: DataHandlerService, private router: Router, private Trans: TranslocoService, private fingerprintService: FingerprintService) { }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!(target).closest('.asidebar')) {
      this.asideBar = false;
      this.isSidebarOpen = false;
    }
  }

  ngOnInit(): void {
    this.selectedWallet = localStorage.getItem('walletId');
    if (this.selectedWallet == null || this.selectedWallet == undefined || this.selectedWallet == '') {
      this.selectedWallet = '-1';
    }

    let sectime = this.dataserve.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey, "walletId": this.selectedWallet }

    // this.dataserve.verifyUser(data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     let validateapi = this.dataserve.decryptData(error.error.text);
    //     if (validateapi.data.type == 'success') {
    //       this.authServe.getUserDetails(data).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let gms = this.dataserve.decryptData(error.error.text);
    //           this.selectedWallet = gms?.data?.sportsWallet;
    //           this.walletsList = JSON.parse(gms.data.wallets);
    //           this.checkSports = this.walletsList?.find((item: { walletId: any; }) => item?.walletId == 1755086397759);
    //           this.loggedData.data.user.myBalance = gms?.data.balance
    //           this.userBalance = this.loggedData?.data?.user?.myBalance;
    //           this.exposure = gms?.data?.liability;
    //           localStorage.setItem("userData", JSON.stringify(this.loggedData));
    //           localStorage.setItem("walletId", this.selectedWallet);
    //           // this.updBal = true;
    //         }
    //       })

    //     }
    //   }
    // })
    this.currentUrl = window.location.href;
    this.referralUrl = document.referrer;
    this.identify();

    let lsData = localStorage.getItem('userData');
    if (lsData) {
      this.loggedData = JSON.parse(lsData);
      this.username = this.loggedData.data.user.userId;
      this.userBalance = this.loggedData.data.user.myBalance;
      this.currency = this.loggedData.data.user.currency;
      this.isB2c = this.loggedData.data.user.isB2c;
      this.agentType = this.loggedData.data.user.agentType;
      this.country = this.loggedData.data.user.country;
      if (this.loggedData.data.login == true) {
        this.afterLogin = true;
        this.beforeLogin = false;
        this.updateBal(this.selectedWallet);
      }

      let ParentCheck = localStorage.getItem('ParentBlocked');
      if (ParentCheck) {
        let cpt = JSON.parse(ParentCheck);
        const referralsts = cpt.data.find((item: any) => item.sportid == "102");
        if (referralsts?.status == "OFF") {
          this.isReferral = false;
        }
        const referralsts2 = cpt.data.find((item: any) => item.sportid == "103");
        if (referralsts2?.status == "OFF") {
          this.isVip = false;
        }
        const referralsts1 = cpt.data.find((item: any) => item.sportid == "104");
        if (referralsts1?.status == "OFF") {
          this.isPromotion = false;
        }
      } else {
        this.getParentBlocked();
      }
    }

    this.authServe.sendLoggedData.subscribe((re: any) => {
      if (re.data.login == true) {
        this.username = re.data?.user.userId;
        this.userBalance = re.data?.user.myBalance;
        this.currency = re.data?.user.myBalance;
        this.isB2c = re.data?.user.isB2c;
        this.afterLogin = true;
        this.beforeLogin = false;

        let ParentCheck = localStorage.getItem('ParentBlocked');
        if (ParentCheck) {
          let cpt = JSON.parse(ParentCheck);
          const referralsts = cpt.data.find((item: any) => item.sportid == "102");
          if (referralsts?.status == "OFF") {
            this.isReferral = false;
          }
          const referralsts2 = cpt.data.find((item: any) => item.sportid == "103");
          if (referralsts2?.status == "OFF") {
            this.isVip = false;
          }
          const referralsts1 = cpt.data.find((item: any) => item.sportid == "104");
          if (referralsts1?.status == "OFF") {
            this.isPromotion = false;
          }
        } else {
          this.getParentBlocked();
        }
      }
    })
    this.dataserve.betSuccessMsg.subscribe((res) => {
      if (res) {
        this.updateBal(this.selectedWallet);
      }
    })
    // this.authServe.loginDt.subscribe((re: any) => {
    //   if (re == true) {
    //     this.ngOnInit();
    //   }
    // })

    // this.authServe.logut.subscribe((res: any) => {
    //   if (res == 'logout') {
    //     this.beforeLogin = true;
    //     this.afterLogin = false;

    //   }
    // })
    this.dataserve.sendWebData.subscribe((res: any) => {
      this.headerLogo = res?.logo
      this.themeData = res?.theme;
    })
    let webdata = localStorage.getItem("webData");
    if (webdata) {
      let formatedDt = JSON.parse(webdata)
      this.headerLogo = formatedDt?.logo;
      this.themeData = formatedDt?.theme;


    }

    let downApp = localStorage.getItem('downloadApp');
    if (downApp == 'false') {
      this.downloadapp = false;
      this.downloadBarClosed.emit(this.downloadapp)
    }

    let langdata = localStorage.getItem("language");
    if (langdata) {
      this.lang = langdata;
    }
  }
  async identify() {
    // const comps = await this.fingerprintService.collect();
    // this.dataserve.getIdentify(comps).subscribe((res: any) => {
    //   if (res) {
    //     this.fingerprintHash = res?.uuid;
    //     this.fingerData = res;
    //   }
    // });
  }
  gefooterLinks() {
    let sectime = this.dataserve.getTimeStamp();

    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    // this.dataserve.verifyUser(data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataserve.getWebsiteLinks(data).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let gms = this.dataserve.decryptData(error.error.text);
    //           let ddaattaa = JSON.parse(gms?.data.data)
    //           this.footerLinkss = ddaattaa
    //           // console.log(this.footerLinkss);

    //           localStorage.setItem('appLink', this.footerLinkss?.applink)
    //         }
    //       })

    //     }
    //   }
    // })
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

  LoginPopup1(data: any) {
    this.username = data.data?.user.userName;
    this.userBalance = data.data?.user.myBalance;
    if (data.data?.login == true) {
      this.afterLogin = true;
      this.beforeLogin = false;
    }
    this.loginPopup = false;
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
  hidePopup() {
    this.loginPopup = false;
    this.regesterPopup = false;
    this.changeLang = false;
  }

  openAsideBar() {
    this.asideBar = true;
  }

  closeAsideBar() {
    this.asideBar = false;
  }

  logout() {
    this.makeUserLogout();

  }

  makeUserLogout() {
    // let sectime = this.authServe.getTimeStamp()
    // let ddt = { "fingerprint": this.fingerprintHash, "components": this.fingerData, "pageUrl": this.currentUrl, "refererUrl": this.referralUrl, "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }
    // this.dataserve.verifyUser(ddt).subscribe((res: any) => {
    //   //console.log('okverify',res);
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {

    //       this.dataserve.makeUserLogout(ddt).subscribe((res: any) => {
    //         // console.log('okGetList', res);
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let gms = this.dataserve.decryptData(error.error.text);
    //           localStorage.clear()
    //           this.authServe.logout()
    //           this.router.navigate(['/home'])
    //         }
    //       })

    //     }
    //   }
    // })

  }
  updateBal(walletId: any) {
    if (this.disabled) {
      return
    }
    this.disabled = true
    this.selectedWallet = walletId;
    this.matchWallet = false;
    this.updBal = false;
    this.spinner = true;
    let sectime = this.dataserve.getTimeStamp();

    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey, "walletId": walletId }

    // this.dataserve.verifyUser(data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.authServe.getUserDetails(data).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let gms = this.dataserve.decryptData(error.error.text);
    //           this.loggedData.data.user.myBalance = gms.data.balance
    //           this.userBalance = this.loggedData.data.user.myBalance;
    //           this.exposure = gms.data.liability;
    //           localStorage.setItem("userData", JSON.stringify(this.loggedData))
    //           this.updBal = true;
    //           this.spinner = false;

    //           localStorage.setItem("walletId", walletId);

    //           this.updateUserMatchWallet(walletId);
    //           setTimeout(() => {
    //             this.disabled = false;
    //           }, 1500);
    //         }
    //         setTimeout(() => {
    //           this.disabled = false;
    //         }, 1500);
    //       })

    //     }
    //   }
    // })
  }

  openforum() {
    let sectime = this.dataserve.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    // this.dataserve.verifyUser(data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataserve.LaunchForum(data).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let gms = this.dataserve.decryptData(error.error.text);
    //           window.location.href = gms.data.url;
    //         }
    //       })
    //     }
    //   }
    // });
  }


  updateUserMatchWallet(walletId: any) {
    let sectime = this.dataserve.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey, "walletId": walletId }
    // this.dataserve.verifyUser(data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataserve.updateUserMatchWallet(data).subscribe((res: any) => {
    //       }, (error) => {
    //         let msd = this.dataserve.decryptData(error.error.text);
    //         if (error.status == 200) {

    //         }
    //       })
    //     }
    //   }
    // })
  }
  openSidebar() {
    this.activeMenu = '';
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  closeSidebar() {
    this.isSidebarOpen = false;
  }

  menuTabs(menu: string): void {
    this.activeMenu = menu;
  }

  navigateTochatbot() {
    let sectime = this.dataserve.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    // this.dataserve.verifyUser(data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataserve.LaunchChatSupport(data).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let gms = this.dataserve.decryptData(error.error.text);
    //           window.location.href = gms.data.url;
    //         }
    //       })
    //     }
    //   }
    // });
  }

  navigateToExch() {
    this.isSidebarOpen = false;
    let token = localStorage.getItem('token')
    if (token) {
      this.router.navigate(['/exchange/mob-sport'])
    } else {
      this.router.navigate(['/login'])
    }
  }

  closeDownloadBar() {
    this.downloadapp = false;
    this.downloadBarClosed.emit(this.downloadapp)
    localStorage.setItem('downloadApp', 'false')
  }

  setActiveLang(lang: string) {
    this.Trans.setActiveLang(lang)
    localStorage.setItem('language', lang)
    this.lang = lang;
    this.isSidebarOpen = false;
    this.showlangpop = false
  }

  getLinkStyles(isActive: boolean): { [key: string]: any } {
    if (isActive) {
      return {
        'background': this.themeData?.masterBgColor6,
        'color': this.themeData?.masterTextColor6
      };
    } else {
      return {
        'background': this.themeData?.sidebarBg,
        'color': this.themeData?.sidebarTextColor
      }
    }
  }
  opensabagamesmob(link: any) {
    let sectime = this.dataserve.getTimeStamp();

    this.data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }
    let token = localStorage.getItem('token')
    if (token) {
      // this.dataserve.verifyUser(this.data).subscribe((res: any) => {
      // }, (error) => {
      //   if (error.status == 200) {
      //     this.validateapi = this.dataserve.decryptData(error.error.text);
      //     if (this.validateapi.data.type == 'success') {
      //       this.dataserve.LaunchSabagms(this.data, link).subscribe((res: any) => {
      //         if (res.gameUrl == '') {
      //           this.showErrPopup = true;
      //           this.errMsg = 'URL not provided in response data.'
      //         } else if (res.type !== 'error') {
      //           this.launchUrl = res.gameUrl;
      //           window.location.href = this.launchUrl;
      //         } else {
      //           this.showErrPopup = true;
      //           this.errMsg = res.message
      //         }
      //       }, (error) => {
      //         // if(error.status==200){
      //         // let gms = this.dataserve.decryptData(error.error.text);
      //         // console.log(error)


      //         // }
      //       })

      //     }
      //   }
      // })
    } else {
      this.router.navigate(['/login'])
    }
    setTimeout(() => {
      this.showErrPopup = false;
    }, 3000)
  }
  openAffiliate() {
    window.open('/assets/affiliate/index.html', '_blank');
  }

  getParentBlocked() {
    let sectime = this.dataserve.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    // this.dataserve.verifyUser(data).subscribe((res: any) => { }, (err) => {
    //   this.dataserve.getParentBlockedList(data).subscribe((res: any) => {
    //   }, (error) => {
    //     let dt = this.authServe.decryptData(error.error.text);
    //     const referralsts = dt.data.find((item: any) => item.sportid == "102");
    //     if (referralsts?.status == "OFF") {
    //       this.isReferral = false;
    //     }
    //     const referralsts2 = dt.data.find((item: any) => item.sportid == "103");
    //     if (referralsts2?.status == "OFF") {
    //       this.isVip = false;
    //     }
    //     const referralsts1 = dt.data.find((item: any) => item.sportid == "104");
    //     if (referralsts1?.status == "OFF") {
    //       this.isPromotion = false;
    //     }

    //     localStorage.setItem("ParentBlocked", JSON.stringify(dt));
    //   })
    // })
  }
  openPopup() {
    // this.dataserve.openPopup();
  }

  walletOpen() {
    if (this.checkSports) {
      this.matchWallet = true;
    }
  }

  closeMatch() {
    this.matchWallet = false;
  }

}
