import { Component, OnInit, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { HandlerService } from 'src/app/services/handler.service';
import { forkJoin, Observable } from 'rxjs';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swiper from 'swiper';

@Component({
  selector: 'app-parlay-sports',
  templateUrl: './parlay-sports.component.html',
  styleUrls: ['./parlay-sports.component.css']
})

export class ParlaySportsComponent implements OnInit, AfterViewInit {

  @ViewChild('tab1') tab1!: ElementRef;
  @ViewChild('tab2') tab2!: ElementRef;
  @ViewChild('tab3') tab3!: ElementRef;
  openData = true
  activeTabId = 4;
  activeTab = 1;
  competion = false
  changestabs = 'by Competition';
  showByCompetition = false;
  showByTime = true;
  showByMatched = true;
  dataoff = false;
  dataD1: number | null = null;
  gameList: any;
  marketList: any;
  cricdata: any;
  soccdata: any;
  tenndata: any;
  addmultires: any;
  isLogin: boolean = false;
  loading: boolean = true;
  type: any = 'Premium';
  stype: any;
  expandedSections: Set<number> = new Set<number>();
  expandedSectionsSoc: Set<number> = new Set<number>();
  expandedSectionsTen: Set<number> = new Set<number>();
  collapseItm = true;
  collapseItmSoc = true;
  collapseItmTen = true;
  CricOrganizedData: { seriesname: string, matches: any[] }[] = [];
  TenOrganizedData: { seriesname: string, matches: any[] }[] = [];
  SocOrganizedData: { seriesname: string, matches: any[] }[] = [];
  activeMarkets : any;
  searchQuery: string = '';
  filteredGameList: any[] = [];
  webdata:any;
  jsonWebdt :any;
  jsonWeblinksdt:any;
  parlay=true;
   tabPositions: { [key: number]: { left: string; width: string } } = {
    1: { left: '6%', width: '0%' },
    2: { left: '22.33%', width: '0%' },
    3: { left: '37%', width: '0%' }
  };

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownList = document.querySelector('.dpshow');
    if (dropdownList && !dropdownList.contains(target) && !target.closest('.dropdown-toggle')) {
      this.competion = false;
    }
  }

  constructor(private popupService: HandlerService, private dataServe: DataHandlerService, private route: Router, private router: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      if(d1?.theme){
        this.jsonWebdt = JSON.parse(d1?.theme)
      }
      if(d1?.links){
        this.jsonWeblinksdt = JSON.parse(d1?.links)
      }
    }

    let token = localStorage.getItem('token');
    if (token) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }

    if(this.type == 'Premium') {
      this.gameList = await this.dataServe.getInPlayGames().toPromise() as any[];
      this.activeTab = 1;
    }
    this.loading = false;
    this.updateSportData();
  }

  filterBySportId(sportId: number): any[] {
    return this.gameList.filter((res: any) => res.sportid === sportId && res.isPremiumData==true);
  }

  updateSportData(): void {
    this.cricdata = this.filterBySportId(4);
    this.soccdata = this.filterBySportId(1);
    this.tenndata = this.filterBySportId(2);
    this.gameList = this.gameList.filter((res: any) => res.isPremiumData==true)
    this.organizeDataBySeriesname();
  }
 organizeDataBySeriesname(): void {
    this.CricOrganizedData = this.dataServe.getOrganizedDataBySeriesname(this.cricdata);
    this.SocOrganizedData = this.dataServe.getOrganizedDataBySeriesname(this.soccdata);
    this.TenOrganizedData = this.dataServe.getOrganizedDataBySeriesname(this.tenndata);
  }
  openMatch(sportid: any, eventid: any) {
    this.route.navigate(['/premium-parlay/' + sportid + '/' + eventid]);
  }

  // async setTab(tabIndex: number) {
  //   this.activeTab = tabIndex;
  //   this.isLogin = false;
  //   if(this.activeTab == 1) {
  //     this.gameList = await this.dataServe.getInPlayGames().toPromise() as any[];
  //     this.updateSportData();
  //   } else if (this.activeTab == 2) {
  //     this.activeTabId = 5;
  //   }
  //   this.updateTabIndicator();
  // }
async setTab(tabIndex: number) {
  this.activeTab = tabIndex;
  this.isLogin = false;

  if (this.activeTab == 1) {
    this.gameList = await this.dataServe.getInPlayGames().toPromise() as any[];
  } else if (this.activeTab == 2) {
    this.gameList = await this.dataServe.getTodayGames().toPromise() as any[];
  } else if (this.activeTab == 3) {
    this.gameList = await this.dataServe.getTomorrowGames().toPromise() as any[];
  }

  // agar koi data nahi mila toh gameList empty array ho
  this.gameList = this.gameList || [];

  // update data aur indicator
  this.updateSportData();
  this.updateTabIndicator();
}

  ngAfterViewInit() {
     new Swiper('.swiper-container10', {
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
          slidesPerView: 2,
          // spaceBetween: 5,
        },
        600: {
          slidesPerView: 2,
          // spaceBetween: 5,
        },
        768: {
          slidesPerView: 2,
          // spaceBetween: 5,
        },
        1024: {
          slidesPerView: 2,
          // spaceBetween: 5,
        },
      },
    });
    setTimeout(() => {
      this.updateTabIndicator();
    }, 100);
  }

  updateTabIndicator() {
    const tabElements = [this.tab1, this.tab2 , this.tab3];
    if (this.activeTab >= 1 && this.activeTab <= 3) {
      const activeTabElement = tabElements[this.activeTab - 1];
      const width = activeTabElement.nativeElement.offsetWidth;
      this.tabPositions[this.activeTab].width = `${width}px`;
    }
  }

  getIndicatorStyles() {
    if (this.activeTab === 4) {
      return { display: 'none' };
    }
    return {
      left: this.tabPositions[this.activeTab]?.left,
      width: this.tabPositions[this.activeTab]?.width
    };
  }
  openBetpop() {
    this.popupService.openBetPopup();
  }

  onCompet() {
    this.competion = !this.competion
  }

  tabsActive(selectedTab: string) {
    this.changestabs = selectedTab;
    this.competion = false;
  }

  dataDD() {
    this.openData = !this.openData
  }

  allOff() {
    this.dataoff = !this.dataoff
    if (this.dataoff === true) {
      this.dataD1 = null
      this.openData = false
    } else {
      this.openData = true
    }
  }

  setActiveTab(tabId: any) {
    this.activeTabId = tabId;
  }

  collapseItem() {
    this.collapseItm = !this.collapseItm;
    if (this.collapseItm) {
      this.CricOrganizedData.forEach((_, index) => this.expandedSections.add(index));
    } else {
      this.expandedSections.clear();
    }
  }
  collapseDetails(index: number) {
    if (this.expandedSections.has(index)) {
      this.expandedSections.delete(index);
    } else {
      this.expandedSections.add(index);
    }
    this.updateAllButtonState();
  }
  updateAllButtonState(): void {
    this.collapseItm = this.expandedSections.size === this.CricOrganizedData.length;
  }
  collapseItemSoc() {
    this.collapseItmSoc = !this.collapseItmSoc;
    if (this.collapseItmSoc) {
      this.SocOrganizedData.forEach((_, index) => this.expandedSectionsSoc.add(index));
    } else {
      this.expandedSectionsSoc.clear();
    }
  }
  collapseDetailsSoc(index: number) {
    if (this.expandedSectionsSoc.has(index)) {
      this.expandedSectionsSoc.delete(index);
    } else {
      this.expandedSectionsSoc.add(index);
    }
    this.updateAllButtonStateSoc();
  }
  updateAllButtonStateSoc(): void {
    this.collapseItmSoc = this.expandedSectionsSoc.size === this.SocOrganizedData.length;
  }
  collapseItemTen() {
    this.collapseItmTen = !this.collapseItmTen;
    if (this.collapseItmTen) {
      this.TenOrganizedData.forEach((_, index) => this.expandedSectionsTen.add(index));
    } else {
      this.expandedSectionsTen.clear();
    }
  }
  collapseDetailsTen(index: number) {
    if (this.expandedSectionsTen.has(index)) {
      this.expandedSectionsTen.delete(index);
    } else {
      this.expandedSectionsTen.add(index);
    }
    this.updateAllButtonStateTen();
  }
  updateAllButtonStateTen(): void {
    this.collapseItmTen = this.expandedSectionsTen.size === this.TenOrganizedData.length;
  }

  expand:any =null
  onExpand(index: any) {
    if (this.expand === index) {
      this.expand = null;
    } else {
      this.expand = index;
    }
  }

  search(){
    // this.onsearch =!this.onsearch
  }
  searchGames() {
    if (this.searchQuery.trim() === '') {
      this.filteredGameList = [...this.gameList];
    } else {
      this.filteredGameList = this.gameList.filter((game: any) =>{
       return game.matchname.toLowerCase().includes(this.searchQuery.toLowerCase())
      }
      );
    }
  }

  updateGameList(newGames: any[]) {
    this.gameList = newGames;
    this.filteredGameList = newGames;
  }
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredGameList = [...this.gameList];
  }
  onsearch() {
    this.popupService.search(this.gameList)
  }
  switchtoparlay(){
    this.parlay = !this.parlay
    if(!this.parlay){
      this.route.navigate(['/sports/Inplay/5']);
    }
  }
}
