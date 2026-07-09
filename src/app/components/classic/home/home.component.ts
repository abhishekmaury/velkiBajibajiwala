import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { FingerprintService } from 'src/app/services/fingerprint.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent1 {
  @ViewChild('promoCarousel', { static: false }) promoCarousel!: CarouselComponent;
  @ViewChild('promo2Carousel', { static: false }) promo2Carousel!: CarouselComponent;
  @ViewChild('marqueeList') marqueeList!: ElementRef;

  loggedData: any;
  username: any;
  userBalance: any;
  isLogin: boolean = false;
  activegame: any = 'Sports';
  activetab = 'Sports';
  validateapi: any;
  gameslist: any;
  data: any;
  gameslist1: any;
  gameslist2: any;
  isLoading = false;
  spinner = false;
  updBal = true;
  loginPopup = false;
  usermessage: any;
  specialgames: any;
  launchUrl: any;
  showErrPopup = false;
  errMsg: any;
  // banners: any;
  domainName: any;
  themeData: any;
  uniqueProviderNames: any;
  currentTab: number = 0;
  previousTab: number = -1
  inboxpopup = false;
  imagesPop: any;
  headerLogo: any;
  exclusiveData: any;
  featuredGames: any;
  casinoGames: any;
  isFixed: boolean = false;
  indiancasinogames: any;
  activeTabs = 1;
  whatsData: any;
  whatsappsupport = false;
  deviceId: string = '';
  walletIDSelect = false;
  walletList: any;
  CaswalletIDSelect = false;
  CaswalletList: any;
  CasUrl: any;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    this.isFixed = scrollPosition > 50; // Adjust scroll threshold as needed
  }


  constructor(private authServe: AuthserviceService,
    private dataserve: DataHandlerService, private fingerprintService: FingerprintService,
    private router: Router, private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef) { }

  customOptions: OwlOptions = {
    loop: true,
    center: true,
    margin: 10,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1.5
      },
      600: {
        items: 1.5
      },
      1000: {
        items: 1.5
      }
    }
  }
  favOptions: any = {
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 3000,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  };
  banners = [
    '/assets/banner/evolution.webp',
    '/assets/banner/sexy.webp',
    '/assets/banner/netent.webp',
    '/assets/banner/kv-hotroad.webp',
    '/assets/banner/kv-smartsoft.webp',
    '/assets/banner/jdb.webp'
  ];
  ngOnInit(): void {
    let lsData = localStorage.getItem('userData');
    if (lsData) {
      this.loggedData = JSON.parse(lsData);
      // this.username = this.loggedData.data.user.userId;
      // this.userBalance = this.loggedData.data.user.myBalance;
      // if (this.loggedData.data.login == true) {
      //   this.isLogin = true;
      //   this.apiddaatta();
      // }
    }
    // this.getDeviceId();
    // this.authServe.logut.subscribe((res: any) => {
    //   if (res == 'logout') {
    //     this.isLogin = false;
    //   }
    // })
    this.dataserve.sendWebData.subscribe((res: any) => {
      // this.banners = res?.banner
      this.domainName = res?.domain
      this.themeData = res?.theme;
      this.headerLogo = res?.logo;
      this.exclusiveData = res?.exclusiveGames;
      this.featuredGames = res?.featuredGames;
      this.casinoGames = res?.CasinoImages;
    })
    let webdata = localStorage.getItem("webData1");
    if (webdata) {
      let formatedDt = JSON.parse(webdata)
      // this.banners = formatedDt?.banner;
      this.domainName = formatedDt?.domain
      // console.log(this.banners);

      this.themeData = formatedDt?.theme;
      this.headerLogo = formatedDt?.logo;
      this.exclusiveData = formatedDt?.exclusiveGames;
      this.featuredGames = formatedDt?.featuredGames;
      this.casinoGames = formatedDt?.CasinoImages;
    }
    // this.marqueeText();
    this.hotgames('Sports');
    // this.startImageRotation();
    this.getPlatFormList();
    this.IndianCasino();


  }

  navigateToGames(gmnm: any, tab: any) {
    this.router.navigate([`/casino/${gmnm}/${tab}`])
  }
  // async getDeviceId() {
  //   const comps = await this.fingerprintService.collect();

  //   this.dataserve.getIdentify(comps).subscribe((res: any) => {
  //     if (res) {
  //       this.deviceId = res?.uuid;
  //     }
  //   })
  // }


  hotgames(gamename: any) {
    window.scrollTo(0, 0);
    this.previousTab = this.currentTab;
    this.activegame = gamename;
    switch (gamename) {
      case 'Sports':
        this.currentTab = 0;
        break;
      case 'CASINO':
        this.currentTab = 1;
        break;
      case 'TYPE':
        this.currentTab = 2;
        break;
      case 'LIVE':
        this.currentTab = 3;
        break;
      case 'SLOT':
        this.currentTab = 4;
        break;
      case 'TABLE':
        this.currentTab = 5;
        break;
      case 'FH':
        this.currentTab = 6;
        break;
      case 'LT':
        this.currentTab = 7;
        break;
      default:
        this.currentTab = 0;
        break;
    }
  }

  getPlatFormList() {
    let data = { "country": 'India' }
    this.dataserve.getProviderData(data).subscribe((res: any) => {
      this.uniqueProviderNames = res?.Providers;
    })
  }

  // marqueeText() {

  //   let sectime = this.dataserve.getTimeStamp();
  //   let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

  //   this.dataserve.verifyUser(data).subscribe((res: any) => {
  //   }, (error) => {
  //     if (error.status == 200) {
  //       this.validateapi = this.dataserve.decryptData(error.error.text);
  //       if (this.validateapi.data.type == 'success') {
  //         this.dataserve.getMessageWebsite(data).subscribe((res: any) => {
  //         }, (error) => {
  //           if (error.status == 200) {
  //             let msd = this.dataserve.decryptData(error.error.text);
  //             this.usermessage = msd.data.data;
  //           }
  //         })
  //       }
  //     }
  //   })
  // }


  ngAfterViewInit(): void {
    new Swiper('.swiper-container', {
      slidesPerView: 1.4,
      centeredSlides: true,
      spaceBetween: 10,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
      pagination: {
        clickable: true,
      },
      navigation: {
        nextEl: '.custom-swiper-button-next',
        prevEl: '.custom-swiper-button-prev',
      },
    });
    let sectime = this.dataserve.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    // this.dataserve.verifyUser(data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataserve.getMessageWebsite(data).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let msd = this.dataserve.decryptData(error.error.text);
    //           this.usermessage = msd.data.data; 
    //           // ✅ Wait for Angular to render <li> items
    //           this.cdr.detectChanges();

    //           setTimeout(() => this.setupMarquee(), 0);
    //         }
    //       })
    //     }
    //   }
    // })
    
    this.dataserve.changeTheme$.subscribe((res: any) => {
      let classicTheme = res;
      
      if (classicTheme == true) {
        this.router.navigate(['/classichome'])
      } else {
        this.router.navigate(['/home'])
      }
    })
    let theme = localStorage.getItem('clssaicTheme');
    if (theme == 'true') {
        this.router.navigate(['/classichome'])
      } else {
        this.router.navigate(['/home'])
      }
  }

  setupMarquee() {
    const listEl = this.marqueeList.nativeElement;
    // console.log(listEl);

    // Duplicate content once
    if (listEl.dataset['duplicated'] !== 'true') {
      listEl.innerHTML += listEl.innerHTML;
      listEl.dataset['duplicated'] = 'true';
    }

    const contentWidth = listEl.scrollWidth / 2;
    const speed = 50; // px/sec
    const duration = contentWidth / speed;

    // reset & apply animation
    listEl.style.animation = 'none';
    void listEl.offsetWidth;
    listEl.style.animation = `scrollLeft ${duration}s linear infinite`;
  }
  hometabs(gamename: any) {

    let sectime = this.dataserve.getTimeStamp();

    this.data = { "provider": 'ALL', "category": gamename, "page": 1, "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey };

    // return new Observable((observer) => {
    //   this.dataserve.verifyUser(this.data).subscribe(
    //     (res: any) => {
    //       // console.log('okverify',res);
    //     },
    //     (error) => {
    //       if (error.status == 200) {
    //         this.validateapi = this.dataserve.decryptData(error.error.text);
    //         if (this.validateapi.data.type == 'success') {
    //           this.dataserve.getGameList(this.data).subscribe(
    //             (res: any) => {
    //               observer.next(res.data);
    //               observer.complete();
    //             },
    //             (error) => {
    //               if (error.status == 200) {
    //                 let gms = this.dataserve.decryptData(error.error.text);
    //                 observer.next(gms.data);
    //                 observer.complete();
    //               }
    //             }
    //           );
    //         }
    //       }
    //     }
    //   );
    // });
  }
  promoR() {
    let token = localStorage.getItem('token')
    if (token) {
      this.router.navigate(['/exchange/sport'])
    } else {
      this.router.navigate(['/login'])
    }
  }
  navigateToSpin() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 900) {
      this.router.navigate(['/simluckywheel'])
    } else {
      this.router.navigate(['/luckywheel'])
    }
  }
  navigateToExch() {
    let token = localStorage.getItem('token')
    if (token) {
      this.isLoading = true;
      // navigate to exch
      this.router.navigate(['/exchange/sport'])
    } else {
      this.router.navigate(['/login'])
    }
  }


  LoginPopup1(data: any) {
    if (data.data?.login == true) {
      setTimeout(() => {
        this.loginPopup = false;
      }, 1000);
    }
    this.loginPopup = data;
  }
  updateBal() {
    this.updBal = false;
    this.spinner = true;
    let sectime = this.dataserve.getTimeStamp();

    this.data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    // this.dataserve.verifyUser(this.data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.authServe.getUserDetails(this.data).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let gms = this.dataserve.decryptData(error.error.text);
    //           this.loggedData.data.user.myBalance = gms.data.balance
    //           this.userBalance = this.loggedData.data.user.myBalance;
    //           localStorage.setItem("userData", JSON.stringify(this.loggedData))
    //           this.updBal = true;
    //           this.spinner = false;
    //         }
    //       })

    //     }
    //   }
    // })
  }
  apiddaatta() {

    let sectime = this.dataserve.getTimeStamp();

    this.data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    // this.dataserve.verifyUser(this.data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataserve.getImageDataForUser(this.data).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let gms = this.dataserve.decryptData(error.error.text);
    //           this.imagesPop = gms?.data
    //           let data = sessionStorage.getItem("showHmPop");
    //           if (data == 'true') {
    //             this.inboxpopup = true;
    //             setTimeout(() => {
    //               sessionStorage.setItem("showHmPop", 'false');
    //             }, 1000);
    //           }

    //         }
    //       })

    //     }
    //   }
    // })
  }

  opencasinogamesmob(data: any) {
    let token = localStorage.getItem('token');
    if (token) {
      this.dataserve.LaunchCasinoGames(data.image_url).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status == 200) {
            const res = response.body;
            this.launchUrl = res.launchUrl;
            window.location.href = this.launchUrl;

          } else {
            const res = response.body;
            this.showErrPopup = true;
            this.errMsg = res.message;
          }
        },
        (error: any) => {
          this.showErrPopup = true;
          this.errMsg = error.message;
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
    setTimeout(() => {
      this.showErrPopup = false;
      this.errMsg = '';
    }, 3000)
  }




  opencasinogames(data: any) {
    let token = localStorage.getItem('token');
    if (token) {
      this.isLoading = true
      this.dataserve.LaunchCasinoGames(data.image_url).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status == 200) {
            const res = response.body;
            this.launchUrl = res.data.url;
            window.location.href = this.launchUrl;
            this.isLoading = false
          } else {
            const res = response.body;
            this.showErrPopup = true;
            this.errMsg = res.message;
            this.isLoading = false
          }
        },
        (error: any) => {
          this.showErrPopup = true;
          this.errMsg = 'Game is not available right now. Please try again later.';
          this.isLoading = false
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
    setTimeout(() => {
      this.showErrPopup = false;
    }, 3000)
  }

  opencricketgame(url: any) {
    // window.open(url, '_blank');
    window.location.href = url;
  }

  getLinkStyles(isActive: boolean): { [key: string]: any } {
    if (isActive) {
      return {
        'background-color': this.themeData?.masterBgColor4,
        'color': this.themeData?.masterTextColor4
      };
    } else {
      return {
        'background-color': this.themeData?.masterBgColor2,
        'color': this.themeData?.masterTextColor2
      }
    }
  }
  getLinkStyles1(isActive: boolean): { [key: string]: any } {
    if (isActive) {
      return {
        'background-color': this.themeData?.masterTextColor1
      };
    } else {
      return {
      }
    }
  }

  currentIndex = 0;
  delay = 5000;
  intervalId: any;
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }



  activeTab: number = 0; // Index of the active tab

  setActiveGame(game: string) {
    this.activegame = game;
    this.activeTab = game === 'Sports' ? 0 : 1; // Update index based on active game
  }
  opensabagamesmob(url: any) {
    let token = localStorage.getItem('token')
    if (token) {
      this.dataserve.LaunchCasinoGames(url).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status == 200) {
            const res = response.body;
            this.launchUrl = res.launchUrl;
            window.location.href = this.launchUrl;
          } else {
            const res = response.body;
            this.showErrPopup = true;
            this.errMsg = res.message;
          }
        },
        (error: any) => {
          this.showErrPopup = true;
          this.errMsg = error.message;

        }
      );
    } else {
      this.router.navigate(['/login'])
    }
    setTimeout(() => {
      this.showErrPopup = false;
    }, 3000)
  }

  opencasinogameslobby(data: any) {
    let token = localStorage.getItem('token');
    if (token) {
      this.isLoading = true;
      this.dataserve.LaunchCasinoGames(data).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status == 200) {
            const res = response.body;
            this.launchUrl = res.data.url;
            window.location.href = this.launchUrl;
            this.isLoading = false;
          } else {
            const res = response.body;
            this.showErrPopup = true;
            this.errMsg = res.message;
            this.isLoading = false;
          }
        },
        (error: any) => {
          this.showErrPopup = true;
          this.errMsg = error.message;
          this.isLoading = false;
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
    setTimeout(() => {
      this.showErrPopup = false;
    }, 3000)
  }

  closePopup() {
    this.inboxpopup = false;
  }
  goToPrevious() {
    this.promoCarousel.prev();
  }
  goToNext() {
    this.promoCarousel.next();
  }
  goPrevious() {
    this.promo2Carousel.prev();
  }
  goNext() {
    this.promo2Carousel.next();
  }
  IndianCasino() {
    this.data = {
      "provider": 'ROYALGAMING',
      "category": 'ALL',
      "page": 1,
      "country": 'India'
    };
    this.dataserve.getCasinoData(this.data).subscribe((res: any) => {
      this.indiancasinogames = res?.all_images;
      this.uniqueProviderNames = res?.Providers;
    });
  }
  activeCasino(data: any) {
    this.activeTabs = data;
  }
  closeCasino() {
    this.CaswalletIDSelect = false;
  }
  getLinkStylesCas(isActive: boolean): { [key: string]: any } {
    if (isActive) {
      return {
        'background-color': this.themeData?.uniactivebgbtncolor,
        'color': this.themeData?.uniactivetextbtncolor
      };
    } else {
      return {
        'background-color': this.themeData?.univinactivebgbtncolor,
        'color': this.themeData?.univinactivetextbtncolor
      }
    }
  }


}
