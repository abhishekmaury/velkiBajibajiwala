import { trigger, transition, style, animate } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, Subject, Subscription, switchMap } from 'rxjs';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { HandlerService } from 'src/app/services/handler.service';
import SwiperCore, { Autoplay, Pagination, Navigation, SwiperOptions, Swiper } from 'swiper';
SwiperCore.use([Autoplay, Pagination, Navigation]);
@Component({
  selector: 'app-casino',
  templateUrl: './casino.component.html',
  styleUrls: ['./casino.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class CasinoComponent implements AfterViewInit, OnInit {
  activeTabId: number = 2;
  @ViewChild('scrollTarget') scrollTarget!: ElementRef;
  observer!: IntersectionObserver;
  gamename = '';
  tabname = '';
  gameslist: any = [];
  providersArr: any[] = [];
  currentPage = 1;
  isLoading: boolean = false;
  scrollSubscription: Subscription = new Subscription()
  apiSubscription: Subscription = new Subscription();
  isScroll: any;
  orginalFilter: any;
  activeIndex: any = 0;
  searchopen = false;
  activesport = 'ALL';
  launchUrl: any;
  showErrPopup = false;
  errMsg: any;
  isscroll = true;
  PopularData: any;
  liveDataAll: any;
  liveData: any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing = 'true';
  storeMsg: any[] = []
  isSearchPageOpen = false
  openSearch = false

  // --
  userName:any
  searchName: string = '';
  searchSubject: Subject<string> = new Subject<string>();
  searchResults: any;
  private subscription: any;
  launchUrl1: any;
  searchHistory: string[] = [];
  isRefreshing = false;
  classicTheme = false;
  constructor(private popupService: HandlerService, private activeRoute: ActivatedRoute, private dataserve: DataHandlerService, private router: Router, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.dataserve.changeTheme$.subscribe((res: any) => {
      this.classicTheme = res;
    })
    let theme = localStorage.getItem('clssaicTheme');
    if (theme == 'true') {
        this.classicTheme = true;
      } else {
        this.classicTheme = false;
      }
    this.gameslist = [];
    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(d1?.theme)
      this.jsonWeblinksdt = JSON.parse(d1?.links)
      this.validShowing = this.jsonWeblinksdt.validShowing;
    }
    let data = localStorage.getItem('userData');
    if (data) {
      let loginResData = JSON.parse(data);
      this.userName = loginResData.userid;
    }
    this.currentPage = 1;
    this.activeRoute.params.subscribe((params: any) => {
      this.gamename = params.gamename;
      this.tabname = params.tabname;
      if (this.gamename == 'POPULAR') {
        this.activeIndex = 0;
        this.activeTabId = 1;
        this.activesport = this.tabname;
        this.LiveCasino(this.tabname, this.gamename)
      } else if (this.gamename == 'LIVE') {
        this.activeIndex = 1;
        this.activeTabId = 1;
        this.activesport = this.tabname;
        this.LiveCasino(this.tabname, this.gamename)
      } else if (this.gamename == 'TABLE') {
        this.activeIndex = 2;
        this.activeTabId = 2;
        this.activesport = this.tabname;
        this.getCasino(this.tabname, this.gamename)
      } else if (this.gamename == 'SLOT') {
        this.activeIndex = 3;
        this.activeTabId = 2;
        this.activesport = this.tabname;
        this.getCasino(this.tabname, this.gamename)
      } else if (this.gamename == 'FH') {
        this.activeIndex = 4;
        this.activeTabId = 2;
        this.activesport = this.tabname;
        this.getCasino(this.tabname, this.gamename)
      } else if (this.gamename == 'EGAME') {
        this.activeIndex = 5;
        this.activeTabId = 2;
        this.activesport = this.tabname;
        this.getCasino(this.tabname, this.gamename)
      }
    })

    // ---

    this.searchcasinodata()

    this.loadSearchHistory();

  }

  searchcasinodata() {
    this.subscription = this.searchSubject.pipe(
      debounceTime(500),              // wait 300ms after typing stops
      switchMap((searchName: string) => {
        if (!searchName.trim()) {
          this.searchResults = []; // clear results when input is empty
          return []; // stop here — don’t call API
        }
        return this.dataserve.getCasinoSearchedData({ search_name: searchName });
      })
    ).subscribe((res: any) => {
      this.searchResults = res?.games;
    });
  }

  LiveCasino(tabname: any, gamename: any) {
    let data = { "category": gamename, "country": 'Bangladesh' };
    this.dataserve.getLiveData(data).subscribe((res: any) => {
      this.liveDataAll = res;
      this.liveData = res?.result;
      //this.providersArr = res?.providers;

      this.providersArr = [
                          "HOTROAD",
                          "EVOLUTION",
                          "PRAGMATICPLAY",
                          "SEXYBCRT",
                          "PLAYTECH"
                      ]

      this.gameslist = res?.result.flatMap((item: any) => item.game_ids);
    })
  }

  getCasino(tabname: any, gamename: any) {
    let data = {
      "provider": tabname,
      "category": gamename,
      "page": 1,
      "country": 'Bangladesh'
    };
    this.dataserve.getCasinoData(data).subscribe((res: any) => {
      let abc = res;
      this.providersArr = abc?.Providers;
      this.orginalFilter = abc?.all_images;
      this.gameslist = abc?.all_images;
      this.isScroll = res?.all_images.length;
    })
  }

  ngAfterViewInit(): void {
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

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoading) {
            if (this.isScroll >= 20) {
              this.loadMoreData();
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (this.scrollTarget) {
      this.observer.observe(this.scrollTarget.nativeElement);
    }
  }


  loadMoreData(): void {
    this.currentPage++;
    let data = {
      "provider": this.tabname,
      "category": this.gamename,
      "page": this.currentPage,
      "country": 'Bangladesh'
    };

    this.dataserve.getCasinoData(data).subscribe((res: any) => {
      let abc = res;
      // if (res?.all_images?.length < 20) {
      //   this.isscroll = false
      // }else{
      //   this.isscroll = true;
      // }
      this.providersArr = abc?.Providers;
      this.gameslist.push(...res.all_images);
      this.isScroll = res?.all_images.length;
    })
  }

  setActiveSlide(index: number) {
    this.currentPage = 1;
    this.activeIndex = index;
    if (index == 0) this.router.navigate([`/casino/POPULAR/ALL`]);
    else if (index == 1) this.router.navigate([`/casino/LIVE/ALL`]);
    else if (index == 2) this.router.navigate([`/casino/TABLE/ALL`]);
    else if (index == 3) this.router.navigate([`/casino/SLOT/ALL`]);
    else if (index == 4) this.router.navigate([`/casino/FH/ALL`]);
    else if (index == 5) this.router.navigate([`/casino/EGAME/ALL`]);
  }
  

 
  setActiveTab(tabId: number) {
    this.activeTabId = tabId;
    if (tabId == 1) {
      this.gameslist.sort((a: any, b: any) => b.favoriteCount - a.favoriteCount)
    } else if (tabId == 2) {
      this.gameslist.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (tabId == 3) {
      this.gameslist.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }
  }
  toggleSearchPage(){
    this.isSearchPageOpen = !this.isSearchPageOpen
  }
  onsearch() {
    // this.popupService.search(this.gameslist)
    this.openSearch = !this.openSearch
    this.searchName = ''

  }

  sportsactive(tabs: any) {
    this.currentPage = 1;
    this.activesport = tabs
    if (this.gamename == 'LIVE') {
      if (tabs == 'ALL') {
        this.liveData = this.liveDataAll?.result;
        this.gameslist = this.liveDataAll?.result.flatMap((item: any) => item.game_ids);
      } else {
        this.liveData = this.filterLiveDataByProvider(tabs);
        this.gameslist = this.liveData.flatMap((item: any) => item.game_ids);
      }
    } else {
      this.router.navigate([`/casino/${this.gamename}/${tabs}`]);
    }

  }

  sortedTabs() {
    return this.providersArr = this.providersArr?.filter((ele: any) => ele !== 'ALL');
    // if (this.activesport === 'ALL') {
    //   return [...this.providersArr];
    // } else {
    //   return [this.activesport, ...this.providersArr?.filter((tab: any) => tab !== this.activesport)];
    // }
  }
  filterLiveDataByProvider = (provider: any) => {
    return this.liveDataAll?.result?.map((item: any) => ({
      ...item,
      game_ids: item.game_ids?.filter((game: any) => game.provider === provider),
    })).filter((item: any) => item.game_ids.length > 0);
  };

  country() {
    this.popupService.openReg();
  }

  opencasinogamesmob(data: any) {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    this.addToSearchHistory();
    let token = localStorage.getItem('token');
    if (token) {
      this.dataserve.LaunchCasinoGames(data.image_url).subscribe(
        (response: HttpResponse<any>) => {
          this.isRefreshing = false;
          if (response.status == 200) {
            const res = response.body;
            this.launchUrl = res.launchUrl;
            window.location.href = this.launchUrl;
          } else {
            this.openSearch = false;
            const res = response.body;
            this.showErrPopup = true;
            this.errMsg = res.message;
            // this.storeMsg.push(this.showErrPopup, this.errMsg)
            // this.popupService.openalert(this.storeMsg)
          }
        },
        (error: any) => {
          this.isRefreshing = false;
          this.showErrPopup = true;
          this.errMsg = error.message;
          // this.storeMsg.push(this.showErrPopup, this.errMsg)
          // this.popupService.openalert(this.storeMsg)

        }
      );
    } else {
      this.isRefreshing = false;
      this.router.navigate(['/login']);
    }
    this.searchName = '';
    this.searchResults = [];
    setTimeout(() => {
      this.showErrPopup = false;
    }, 3000)

  }

  // ----

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // clean up
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchName); // emit value to Subject
  }
  // Load history from localStorage
  loadSearchHistory() {
    const saved = localStorage.getItem('searchHistory');
    this.searchHistory = saved ? JSON.parse(saved) : [];
  }

  // Add current searchName to history
  addToSearchHistory() {
    const name = this.searchName.trim();
    if (!name) return;

    // Remove if already exists (so latest goes first)
    this.searchHistory = this.searchHistory.filter(item => item !== name);

    // Add to front
    this.searchHistory.unshift(name);

    // Keep only 15 items
    if (this.searchHistory.length > 15) {
      this.searchHistory.pop();
    }

    // Save to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }

  // Optional — Clear history
  clearHistory() {
    this.searchHistory = [];
    localStorage.removeItem('searchHistory');
  }

  onHistoryClick(item: string) {
    // 🔹 Set the clicked value to search input
    this.searchName = item;
   this.searchSubject.next(item);

  }

  highlightMatch(text: string): string {
  if (!this.searchName) return text;

  const regex = new RegExp(`(${this.searchName})`, 'gi'); // case-insensitive
  return text.replace(regex, `<span  class="text-back-600 font-bold">$1</span>`);
}
}
