import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { HandlerService } from 'src/app/services/handler.service';
import SwiperCore, { Autoplay, Pagination, Navigation, SwiperOptions, Swiper } from 'swiper';

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-home-original',
  templateUrl: './home-original.component.html',
  styleUrls: ['./home-original.component.css'],
})
export class HomeOriginalComponent implements OnInit {

  livetab: number = 1;
  tabeltab: number = 1;
  slot: number = 1;
  fishing: number = 1;
  egame: number = 1;
  todayGamesCount: any;
  cricketCount: any;
  soccerCount: any;
  tennisCount: any;
  todayCricketCount: any;
  todaySoccerCount: any;
  todayTennisCount: any;
  inplayGamesCount: any;
  tommorrowGamesCount: any;
  tomCricketCount: any;
  tomSoccerCount: any;
  tomTennisCount: any;
  // count: any;
  loggedIn = false;
  gameslist: any = [];
  providersArr: any = [];
  category: any;
  launchUrl: any;
  showErrPopup = false;
  errMsg: any;
  liveData: any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  storeMsg: any[] = []
  backgroundImg: any;
  isToggled = false

  @ViewChildren('tabRef') tabRefs!: QueryList<ElementRef<HTMLDivElement>>;

  constructor(private popupService: HandlerService, private dataserve: DataHandlerService, private router: Router) { }

  ngOnInit() {
    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.backgroundImg = this.webdata?.imageData?.inplay;
      if (d1?.theme) {
        this.jsonWebdt = JSON.parse(d1?.theme)
      }
      if (d1?.links) {
        this.jsonWeblinksdt = JSON.parse(d1?.links)
      }
    }

    this.dataserve.getWebsiteData().subscribe((res) => {
      localStorage.setItem("webData", JSON.stringify(res))
    })

    this.dataserve.getInPlayGames().subscribe((response: any) => {
      this.inplayGamesCount = response?.length || 0;
      if (response?.length >= 0) {
        this.cricketCount = response.filter((game: any) => game.sportid === 4).length;
        this.soccerCount = response.filter((game: any) => game.sportid === 1).length;
        this.tennisCount = response.filter((game: any) => game.sportid === 2).length;
      }
    });
    this.dataserve.getTodayGames().subscribe((response: any) => {
      this.todayGamesCount = response?.length || 0;
      if (response?.length >= 0) {
        this.todayCricketCount = response.filter((game: any) => game.sportid === 4).length;
        this.todaySoccerCount = response.filter((game: any) => game.sportid === 1).length;
        this.todayTennisCount = response.filter((game: any) => game.sportid === 2).length;
      }
    });
    this.dataserve.getTomorrowGames().subscribe((response: any) => {
      this.tommorrowGamesCount = response?.length || 0;
      if (response?.length >= 0) {
        this.tomCricketCount = response.filter((game: any) => game.sportid === 4).length;
        this.tomSoccerCount = response.filter((game: any) => game.sportid === 1).length;
        this.tomTennisCount = response.filter((game: any) => game.sportid === 2).length;
      }
    });
    let token = localStorage.getItem('token')
    if (token) {
      this.loggedIn = true
      // this.dataserve.getActiveLiabUserWise().subscribe((res: any) => {
      //   this.count = res.length
      // })
    } else {
      this.loggedIn = false
    }
  }
  ngAfterViewInit(): void {
    new Swiper('.swiper-container', {
      slidesPerView: 1,
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
    new Swiper('.swiper-container1', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      navigation: {
        nextEl: '.custom-swiper-button-next1',
        prevEl: '.custom-swiper-button-prev1',
      },

      breakpoints: {
        0: {
          slidesPerView: 5,
          spaceBetween: 5,
        },
        600: {
          slidesPerView: 5,
          spaceBetween: 5,
        },
        768: {
          slidesPerView: 5,
          spaceBetween: 5,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 5,
        },
      },
    });
  }
  activeTabId = 1;
  activeSwiper = 1;
  searchCountry = false
  setActiveTab(tabId: number) {
    this.activeTabId = tabId;
  }
  setActiveSwiperTab(tabId: number) {
    this.activeSwiper = tabId;
    this.casinolist(tabId)
  }

  setActivelive(tabId: number) {
    this.livetab = tabId
    if (tabId == 2) {
      this.gameslist.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (tabId == 3) {
      this.gameslist.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }
  setActivetable(tabId: number) {
    this.tabeltab = tabId;
    if (tabId == 1) {
      this.gameslist.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (tabId == 2) {
      this.gameslist.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }
  setActiveSlot(tabId: number) {
    this.slot = tabId
    if (tabId == 1) {
      this.gameslist.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (tabId == 2) {
      this.gameslist.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }
  setActiveFishing(tabId: number) {
    this.fishing = tabId
    if (tabId == 1) {
      this.gameslist.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (tabId == 2) {
      this.gameslist.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }
  setActiveEgame(tabId: number) {
    this.egame = tabId
    if (tabId == 1) {
      this.gameslist.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (tabId == 2) {
      this.gameslist.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }
  country() {
    this.popupService.openReg();
  }

  casinolist(category: any) {
    if (category == 2) {
      this.category = 'LIVE'
      let data = { "category": this.category, "country": 'Bangladesh' };
      this.dataserve.getLiveData(data).subscribe((res: any) => {
        this.liveData = res?.result;
        this.gameslist = this.liveData.flatMap((item: any) => item.game_ids);
      })
    } if (category == 3) {
      this.category = 'TABLE'
      let data = {
        "provider": 'ALL',
        "category": this.category,
        "page": 1,
        "country": 'Bangladesh'
      };
      this.dataserve.getCasinoData(data).subscribe((res: any) => {
        let abc = res;
        this.providersArr = abc?.Providers;
        this.gameslist = abc?.all_images
      })
    } else if (category == 4) {
      this.category = 'SLOT'
      let data = {
        "provider": 'ALL',
        "category": this.category,
        "page": 1,
        "country": 'Bangladesh'
      };
      this.dataserve.getCasinoData(data).subscribe((res: any) => {
        let abc = res;
        this.providersArr = abc?.Providers;
        this.gameslist = abc?.all_images
      })
    } else if (category == 5) {
      this.category = 'FH'
      let data = {
        "provider": 'ALL',
        "category": this.category,
        "page": 1,
        "country": 'Bangladesh'
      };
      this.dataserve.getCasinoData(data).subscribe((res: any) => {
        let abc = res;
        this.providersArr = abc?.Providers;
        this.gameslist = abc?.all_images
      })
    } else if (category == 6) {
      this.category = 'EGAME'
      let data = {
        "provider": 'ALL',
        "category": this.category,
        "page": 1,
        "country": 'Bangladesh'
      };
      this.dataserve.getCasinoData(data).subscribe((res: any) => {
        let abc = res;
        this.providersArr = abc?.Providers;
        this.gameslist = abc?.all_images
      })
    }
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
            this.storeMsg.push(this.showErrPopup, this.errMsg)
            this.popupService.openalert(this.storeMsg)
          }
        },
        (error: any) => {
          this.showErrPopup = true;
          this.errMsg = error.message;
          this.storeMsg.push(this.showErrPopup, this.errMsg)
          this.popupService.openalert(this.storeMsg)
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
    setTimeout(() => {
      this.showErrPopup = false;
    }, 3000)
  }


  activeIndex = 1;
  hoveredTab: number | null = null;
  indicatorStyle = {
    transform: 'translateX(0)',
    transition: 'transform 0.4s ease',
  };


  getTabClass(index: number) {

    if (this.hoveredTab !== null && this.hoveredTab !== this.activeSwiper) {
      return this.activeSwiper === index ? '' : '';
    }
    return {
      'hoverEffect': index === this.hoveredTab && index !== this.activeSwiper
    };

  }

  onHover(index: number) {
    if (index === this.activeSwiper) {
      this.hoveredTab = null;
      return;
    }
    this.hoveredTab = index;
    this.moveIndicator(index);
  }

  onLeave() {
    this.hoveredTab = null;
    this.moveIndicator(this.activeSwiper);
  }

  setActive(index: number) {
    this.activeSwiper = index;
    this.hoveredTab = null;
    this.moveIndicator(index);
  }

  // moveIndicator(index: number) {
  //   const offset = (index - 1) * 100;
  //   this.indicatorStyle = {
  //     ...this.indicatorStyle,
  //     transform: `translateX(${offset}px)`,
  //   };
  // }

  moveIndicator(index: number) {
    const tabElements = this.tabRefs.toArray();
    const selectedTab = tabElements[index - 1].nativeElement;
    const indicatorWidth = 60;
    const tabCenter = selectedTab.offsetLeft + selectedTab.offsetWidth / 5;
    const indicatorPosition = tabCenter - indicatorWidth / 5;
    this.indicatorStyle = {
      ...this.indicatorStyle,
      transform: `translateX(${indicatorPosition}px)`,
    };
  }
  naviageteToLeague(route: any) {
    if (route == 'league') {
      this.dataserve.emitRouteActive.next(3)
      this.router.navigate([`/${route}`])
    } else if (route.startsWith('casino')) {
      this.dataserve.emitRouteActive.next(1)
      this.router.navigate([`/${route}`])
    } else {
      this.dataserve.emitRouteActive.next(2)
      this.router.navigate([`/${route}`])
    }
  }
    toggleSwitch() {
    this.isToggled = !this.isToggled;
    this.dataserve.getThemeFlag(this.isToggled)
    localStorage.setItem('clssaicTheme', JSON.stringify(this.isToggled))

    document.documentElement.style.display = 'none';
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
    if (this.router.url.includes('sports')) {
      this.router.navigate(['/home']).then(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }
}
