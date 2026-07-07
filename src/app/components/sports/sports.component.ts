import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HandlerService } from 'src/app/services/handler.service';
import { forkJoin, Observable } from 'rxjs';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import * as moment from 'moment';
import { GetSocketUrlService } from 'src/app/services/get-socket-url.service';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css']
})

export class SportsComponent implements OnInit {

  // @ViewChild('tab1') tab1!: ElementRef;
  // @ViewChild('tab2') tab2!: ElementRef;
  // @ViewChild('tab3') tab3!: ElementRef;
  openData = true
  activeTabId = 5;
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
  type: any;
  stype: any;
  expandedSections: Set<any> = new Set<any>();
  expandedSectionsSoc: Set<any> = new Set<any>();
  expandedSectionsTen: Set<any> = new Set<any>();
  collapseItm = true;
  collapseItmSoc = true;
  collapseItmTen = true;
  CricOrganizedData: { seriesname: string, matches: any[] }[] = [];
  TenOrganizedData: { seriesname: string, matches: any[] }[] = [];
  SocOrganizedData: { seriesname: string, matches: any[] }[] = [];
  activeMarkets: any;
  searchQuery: string = '';
  filteredGameList: any[] = [];
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  parlay = false;
  oddsub: any;
  runnersList: any = [];
  socketEventOdds: any = [];
  filteredMarketIds: any;
  tabPositions: { [key: number]: { left: string; width: string } } = {
    1: { left: '6%', width: '0%' },
    2: { left: '22.33%', width: '0%' },
    3: { left: '37%', width: '0%' }
  };

  showOdd = null
  showBackSelect = null
  showLaySelect = null
  oddtimeout: any;
  classclrforlayBack: any;
  oddPrice: any;
  showBM = null;
  backTrue: boolean = false;
  inplaystatus: boolean = false;
  showBetMsg: boolean = false;
  inplay: boolean = false;
  betSuccess: any;
  betsuccessstatus: any;
  betMsgTimer: any;

  betOddResult: any;
  oddsPnlArray: any[] = [];
  beforeoddsPnlArray: any[] = [];
  afteroddsPnlArray: any[] = [];
  oddpnl1: any = 0;
  oddpnl2: any = 0;
  oddpnl3: any = 0;
  getMatcBkData = false;
  beforeoddscal = false;
  afteroddscal = false;

  activeTab1: number = 0;
  indicatorWidth: number = 0;
  indicatorLeft: number = 0;
  isRefreshing = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownList = document.querySelector('.dpshow');
    if (dropdownList && !dropdownList.contains(target) && !target.closest('.dropdown-toggle')) {
      this.competion = false;
    }
  }

  constructor(private popupService: HandlerService, private dataServe: DataHandlerService,
    private socket: SocketServiceService, private route: Router, private getSocketPath : GetSocketUrlService, private router: ActivatedRoute) { }

  async ngOnInit() {
    await this.getSocketPath.getSocketUrl();

    this.dataServe.betSuccessMsg.subscribe((res: any) => {
      this.betSuccess = res;
      this.showOdd = null
      this.beforeoddscal = false;
      this.afteroddscal = false;
      this.beforeoddsPnlArray = [0, 0, 0];
      this.afteroddsPnlArray = [0, 0, 0];
      this.showBetMsg = true;
      if (res[3].type == 'success') {
        this.getBookdata();
      }

      this.betsuccessstatus = this.betSuccess[0];
      this.betMsgTimer = setTimeout(() => {
        this.showBetMsg = false;
      }, 5000);
    })
    this.loading = true;
    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      if (d1?.theme) {
        this.jsonWebdt = JSON.parse(d1?.theme)
      }
      if (d1?.links) {
        this.jsonWeblinksdt = JSON.parse(d1?.links)
      }
    }

    this.socket.connectSocket();

    this.router.paramMap.subscribe((id: ParamMap) => {
      this.type = id.get('type')
      this.stype = id.get('stype')
      this.activeTabId = this.stype
    })

    let token = localStorage.getItem('token');
    try {
      if (token) {
        this.getBookdata();
        this.isLogin = true;
        if (this.type == 'Inplay') {
          const [multiMarketResponse, inPlayGamesResponse] = await forkJoin([
            this.dataServe.getUserWiseMultiMarket(),
            this.dataServe.getInPlayGames()
          ]).toPromise() as any;
          this.marketList = (multiMarketResponse as any[]).map((rs: any) => (rs.matchid));
          this.gameList = inPlayGamesResponse as any[];
          this.gameList = this.gameList.map((r: any) => ({
            ...r,
            multi: !this.marketList.includes(r.eventid)
          }));
          this.activeTab = 1;
        } else if (this.type == 'Today') {
          const [multiMarketResponse1, inPlayGamesResponse1] = await forkJoin([
            this.dataServe.getUserWiseMultiMarket(),
            this.dataServe.getTodayGames()
          ]).toPromise() as any;
          this.marketList = (multiMarketResponse1 as any[]).map((rs: any) => (rs.matchid));
          this.gameList = inPlayGamesResponse1 as any[];
          this.gameList = this.gameList.map((r: any) => ({
            ...r,
            multi: !this.marketList.includes(r.eventid)
          }));
          this.activeTab = 2;
        } else if (this.type == 'Tomorrow') {
          const [multiMarketResponse2, inPlayGamesResponse2] = await forkJoin([
            this.dataServe.getUserWiseMultiMarket(),
            this.dataServe.getTomorrowGames()
          ]).toPromise() as any;
          this.marketList = (multiMarketResponse2 as any[]).map((rs: any) => (rs.matchid));
          this.gameList = inPlayGamesResponse2 as any[];
          this.gameList = this.gameList.map((r: any) => ({
            ...r,
            multi: !this.marketList.includes(r.eventid)
          }));
          this.activeTab = 3;
        }
        this.updateSportData();
      } else {
        this.isLogin = false;
        if (this.type == 'Inplay') {
          this.gameList = await this.dataServe.getInPlayGames().toPromise() as any[];
          this.activeTab = 1;
        } else if (this.type == 'Today') {
          this.gameList = await this.dataServe.getTodayGames().toPromise() as any[];
          this.activeTab = 2;
        } else if (this.type == 'Tomorrow') {
          this.gameList = await this.dataServe.getTomorrowGames().toPromise() as any[];
          this.activeTab = 3;
        }
        this.updateSportData();
      }

    } finally {
      this.loading = false;
    }
    this.allMethods();
  }

  allMethods() {
    this.CricOrganizedData.forEach((_, index) => this.expandedSections.add(index));
    this.SocOrganizedData.forEach((_, index) => this.expandedSectionsSoc.add(index));
    this.TenOrganizedData.forEach((_, index) => this.expandedSectionsTen.add(index));
  }

  filterBySportId(sportId: number): any[] {
    return this.gameList.filter((res: any) => res.sportid === sportId);
  }

  updateSportData(): void {
    this.cricdata = this.filterBySportId(4);
    this.soccdata = this.filterBySportId(1);
    this.tenndata = this.filterBySportId(2);
    this.organizeDataBySeriesname();
  }

  getBookdata() {
    let type = 'Match odds';
    this.dataServe.getUserMatchListBookData(type).subscribe((res: any) => {
      this.oddsPnlArray = res;
    })
  }
  getPnlByEventId(eventId: string): number | null {
  const event = this.oddsPnlArray.find(item => item.eventid === eventId);
  if (!event) return null;
  return event;
}
  organizeDataBySeriesname(): void {
    this.CricOrganizedData = this.dataServe.getOrganizedDataBySeriesname(this.cricdata);
    this.SocOrganizedData = this.dataServe.getOrganizedDataBySeriesname(this.soccdata);
    this.TenOrganizedData = this.dataServe.getOrganizedDataBySeriesname(this.tenndata);
    this.getOddsData(this.CricOrganizedData)
    this.getOddsData(this.SocOrganizedData)
    this.getOddsData(this.TenOrganizedData)
  }

  getOddsData(data: any) {
    data.forEach((el: any) => {
      this.filteredMarketIds = el.matches
        .filter((re: any, ind: number) => {
          return re.matchType == 'normal' && re.b1 !== undefined && re.isPriority !== undefined && re.isPriority === true;
        })
        .map((match: any) => match.marketid);

      this.filteredMarketIds.forEach((ele: any) => {
        this.socket.setOdds(ele);
        this.socket.getOdds(ele);
      });
    });
    this.oddsub = this.socket.getUpdateMessageListner().subscribe((res: any) => {
      const eventId = String(res.eventId);
      const eventData = res.message;
      this.runnersList[eventId] = eventData;
      this.socketEventOdds[eventId] = res.message.events;
    })
  }

  getRunnerData(marketid: string) {
    return this.runnersList[marketid];
  }


  ngOnDestroy() {
    this.socket.destroySocketMultiple();
    if (this.oddsub) {
      this.oddsub.unsubscribe();
    }
  }

  async addToMultimarket(id: any): Promise<void> {
    let token = localStorage.getItem('token');
    if (token) {
      let eventId = id.eventid;
      this.addmultires = await this.dataServe.addToMultmarketList(eventId).toPromise();
      if (this.addmultires.type == 'success' && this.addmultires.message == 'Game Added as Multi Market') {
        this.marketList.push(eventId);
        id.multi = false;
      } else if (this.addmultires.type == 'success' && this.addmultires.message == 'Game Removed From Multi Market') {
        this.marketList.push(eventId);
        id.multi = true;
      }
    }
  }

  async addToMultimarket1(id: any): Promise<void> {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    let token = localStorage.getItem('token');
    if (token) {
      try {
        let eventId = id;
        this.addmultires = await this.dataServe.addToMultmarketList(eventId).toPromise();
        this.ngOnInit();
      } finally {
        setTimeout(() => {
          this.isRefreshing = false;
        }, 500);
      }
    } else {
      this.isRefreshing = false;
    }
  }
  openResults() {
    const token = localStorage.getItem('token');
    if (token) {
      this.route.navigate(['/Mchecksportwiseresult']);
    } else {
      this.route.navigate(['/mob-login']);
    }
  }

  openMatch(sportid: any, eventid: any, iscupwinner: any) {
    if (iscupwinner) {
      this.route.navigate(['/mob-match-cupwinner/' + sportid + '/' + eventid]);
    } else {
      this.route.navigate(['/market/' + sportid + '/' + eventid]);
    }
  }

  async setTab(tabIndex: number) {
    if (this.activeTab === tabIndex || this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    this.activeTab = tabIndex;
    //  this.activeTab1 = tabIndex;

    let token = localStorage.getItem('token');
    try {
      if (token) {
        this.isLogin = true;
        if (this.activeTab == 1) {
          this.resetCollapse()
          const [multiMarketResponse, inPlayGamesResponse] = await forkJoin([
            this.dataServe.getUserWiseMultiMarket(),
            this.dataServe.getInPlayGames()
          ]).toPromise() as any;
          this.marketList = (multiMarketResponse as any[]).map((rs: any) => (rs.matchid));
          this.gameList = inPlayGamesResponse as any[];
          this.gameList = this.gameList.map((r: any) => ({
            ...r,
            multi: !this.marketList.includes(r.eventid)
          }));
          this.updateSportData();
        } else if (this.activeTab == 2) {
          this.resetCollapse()
          const [multiMarketResponse, inPlayGamesResponse] = await forkJoin([
            this.dataServe.getUserWiseMultiMarket(),
            this.dataServe.getTodayGames()
          ]).toPromise() as any;
          this.marketList = (multiMarketResponse as any[]).map((rs: any) => (rs.matchid));
          this.gameList = inPlayGamesResponse as any[];
          this.gameList = this.gameList.map((r: any) => ({
            ...r,
            multi: !this.marketList.includes(r.eventid)
          }));
          this.updateSportData();
        } else if (this.activeTab == 3) {
          this.resetCollapse()
          const [multiMarketResponse, inPlayGamesResponse] = await forkJoin([
            this.dataServe.getUserWiseMultiMarket(),
            this.dataServe.getTomorrowGames()
          ]).toPromise() as any;
          this.marketList = (multiMarketResponse as any[]).map((rs: any) => (rs.matchid));
          this.gameList = inPlayGamesResponse as any[];
          this.gameList = this.gameList.map((r: any) => ({
            ...r,
            multi: !this.marketList.includes(r.eventid)
          }));
          this.updateSportData();
        } else if (this.activeTab == 4) {
          this.dataServe.getUserWiseMultiMarket().subscribe((res: any) => {
            this.activeMarkets = res
            this.isRefreshing = false;
            },
            () => {
              this.isRefreshing = false;
            }
          );

          return;
        }
      } else {
        this.isLogin = false;
        if (this.activeTab == 1) {
          this.gameList = await this.dataServe.getInPlayGames().toPromise() as any[];
        } else if (this.activeTab == 2) {
          this.gameList = await this.dataServe.getTodayGames().toPromise() as any[];
        } else if (this.activeTab == 3) {
          this.gameList = await this.dataServe.getTomorrowGames().toPromise() as any[];
        }
        this.updateSportData();
      }
    } finally {
      this.loading = false;
      this.isRefreshing = false;
    }
    this.updateTabIndicator();
  }
  resetCollapse() {
    this.collapseItm = true
    this.collapseItmSoc = true
    this.collapseItmTen = true
    this.CricOrganizedData.forEach((_, index) => this.expandedSections.add(index));
    this.SocOrganizedData.forEach((_, index) => this.expandedSectionsSoc.add(index));
    this.TenOrganizedData.forEach((_, index) => this.expandedSectionsTen.add(index));
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateTabIndicator();
    }, 100);
  }

  // updateTabIndicator() {
  //   const tabElements = [this.tab1, this.tab2, this.tab3];
  //   if (this.activeTab >= 1 && this.activeTab <= 3) {
  //     const activeTabElement = tabElements[this.activeTab - 1];
  //     const width = activeTabElement.nativeElement.offsetWidth;
  //     this.tabPositions[this.activeTab].width = `${width}px`;
  //   }
  // }
  private updateTabIndicator(): void {
    const activeTabElement = document.querySelectorAll('.tab')[this.activeTab - 1] as HTMLElement;
    this.indicatorWidth = activeTabElement.offsetWidth;
    this.indicatorLeft = activeTabElement.offsetLeft;
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
      //  this.dataD1=true
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

  expand: any = null
  onExpand(index: any) {
    if (this.expand === index) {
      this.expand = null;
    } else {
      this.expand = index;
    }
  }

  search() {
    // this.onsearch =!this.onsearch
  }
  searchGames() {
    if (this.searchQuery.trim() === '') {
      this.filteredGameList = [...this.gameList];
    } else {
      this.filteredGameList = this.gameList.filter((game: any) => {
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
  switchtoparlay() {
    this.parlay = !this.parlay
    if (this.parlay) {
      this.route.navigate(['/sports/parlay'])
    }
  }
  showbeforecal = false;
  eventidd: any;
  openOddBetPlace(i: any, str: any, price: any, list: any) {

    let token = localStorage.getItem('token');
    if (token) {
      this.eventidd = price?.[0]?.eventId;

      if(this.oddsPnlArray){
        this.betOddResult = this.oddsPnlArray.find((ele : any) => ele.eventid == this.eventidd)
      if(this.betOddResult != null || this.betOddResult != undefined){
        this.showbeforecal = false
        this.beforeoddscal = false
      }else{
        this.beforeoddscal = true
        this.showbeforecal = true
        let obj = {
          selection1 : list?.selectionids?.split(',')?.[0],
          selection2 : list?.selectionids?.split(',')?.[1],
          pnl1 : 0,
          pnl2 : 0,
          pnl3 : 0
        }
        this.betOddResult = obj;
      }

      }
      this.inplaystatus = this.inPlayMatches(list);

      clearTimeout(this.oddtimeout)
      this.classclrforlayBack = str
      this.oddPrice = price

      this.showBM = null;

      if (str == 'back') {
        this.backTrue = true
        this.showOdd = i;
      } else if (str == 'lay') {
        this.backTrue = false
        this.showOdd = i;
      }
    } else {
      this.route.navigate(['/login'])
    }
    this.oddtimeout = setTimeout(() => {
      this.beforeoddscal = false;
      this.afteroddscal = false;
      this.showOdd = null
      // this.showBackSelect = null;
      // this.showLaySelect = null;
    }, 10000);
  }
  stopTimeout(data: any) {
    if (data == true) {
      clearTimeout(this.oddtimeout)

    }
    this.showBM = null;
  }
  inPlayMatches(data: any) {
    if (data?.sportid == 4) {
      let date = this.datetimeconvert(data?.opendate);
      let withinHrs = moment(date).subtract(15, 'minutes').format('MM/DD/YYYY HH:mm:ss');
      let date3 = new Date();
      let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');
      if (moment(currentDate).isAfter(withinHrs)) {
        this.inplay = true
        return this.inplay;
      } else {
        this.inplay = false
        return this.inplay;
      }
    } else {
      let date = this.datetimeconvert(data?.opendate);
      let withinHrs = moment(date).format('MM/DD/YYYY HH:mm:ss');
      let date3 = new Date();
      let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');
      if (moment(currentDate).isAfter(withinHrs)) {
        this.inplay = true
        return this.inplay;
      } else {
        this.inplay = false
        return this.inplay;
      }
    }
  }
  closeBet() {
    this.showBetMsg = false
    this.showBM = null;
    clearTimeout(this.betMsgTimer)
  }

  datetimeconvert(data: any) {
    const dateTime = new Date(data);
    const utcYear = dateTime.getUTCFullYear();
    const utcMonth = padZero(dateTime.getUTCMonth() + 1); // Months are 0-indexed
    const utcDate = padZero(dateTime.getUTCDate());
    const utcHours = padZero(dateTime.getUTCHours());
    const utcMinutes = padZero(dateTime.getUTCMinutes());
    const utcSeconds = padZero(dateTime.getUTCSeconds());

    function padZero(value: any) {
      return value < 10 ? `0${value}` : value;
    }
    const opendate = `${utcYear}-${utcMonth}-${utcDate} ${utcHours}:${utcMinutes}:${utcSeconds}`;
    return opendate;
  }
  getOddsCalculation(result: any) {
    if (result == false) {
      this.showOdd = null;
      this.beforeoddscal = false;
      this.afteroddscal = false;
      this.beforeoddsPnlArray = [0, 0, 0];
      this.afteroddsPnlArray = [0, 0, 0];
    } else {
      let stake = result[1];
      if (result[0].sourceBetType == 'Odds') {
        if(this.showbeforecal == false){
        if (this.betOddResult?.selection1 == result[0].selectionId) {
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1) * stake;
          if (result[0].isBack == true) {
            this.oddpnl1 = this.betOddResult.pnl1 + respnl;
            this.oddpnl2 = this.betOddResult.pnl2 - stake;
            this.oddpnl3 = this.betOddResult.pnl3 - stake;
          } else {
            this.oddpnl1 = this.betOddResult.pnl1 - respnl;
            this.oddpnl2 = this.betOddResult.pnl2 + stake;
            this.oddpnl3 = this.betOddResult.pnl3 + stake;
          }
          this.afteroddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];

        } else if (this.betOddResult?.selection2 == result[0].selectionId) {
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1) * stake;
          if (result[0].isBack == true) {
            this.oddpnl1 = this.betOddResult.pnl1 - stake;
            this.oddpnl2 = this.betOddResult.pnl2 + respnl;
            this.oddpnl3 = this.betOddResult.pnl3 - stake;
          } else {
            this.oddpnl1 = this.betOddResult.pnl1 + stake;
            this.oddpnl2 = this.betOddResult.pnl2 - respnl;
            this.oddpnl3 = this.betOddResult.pnl3 + stake;
          }
          this.afteroddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];
        } else if (this.betOddResult?.selection3 == result[0].selectionId) {
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1) * stake;
          if (result[0].isBack == true) {
            this.oddpnl1 = this.betOddResult.pnl1 - stake;
            this.oddpnl2 = this.betOddResult.pnl2 - stake;
            this.oddpnl3 = this.betOddResult.pnl3 + respnl;
          } else {
            this.oddpnl1 = this.betOddResult.pnl1 + stake;
            this.oddpnl2 = this.betOddResult.pnl2 + stake;
            this.oddpnl3 = this.betOddResult.pnl3 - respnl;
          }
          this.afteroddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];

        }
      } else {
          this.getMatcBkData = false;
          this.afteroddscal = false;
          this.beforeoddscal = true;
          if (this.betOddResult?.selection1 == result[0].selectionId) {
            let respnl = (result[0].odds - 1) * stake;
            if (result[0].isBack == true) {
              this.oddpnl1 = 0 + respnl;
              this.oddpnl2 = 0 - stake;
              this.oddpnl3 = 0 - stake;
            } else {
              this.oddpnl1 = 0 - respnl;
              this.oddpnl2 = 0 + stake;
              this.oddpnl3 = 0 + stake;
            }
          } else if (this.betOddResult?.selection2 == result[0].selectionId) {
            let respnl = (result[0].odds - 1) * stake;
            if (result[0].isBack == true) {
              this.oddpnl1 = 0 - stake;
              this.oddpnl2 = 0 + respnl;
              this.oddpnl3 = 0 - stake;
            } else {
              this.oddpnl1 = 0 + stake;
              this.oddpnl2 = 0 - respnl;
              this.oddpnl3 = 0 + stake;
            }
          } else if (this.betOddResult?.selection3 == result[0].selectionId) {
            let respnl = (result[0].odds - 1) * stake;
            if (result[0].isBack == true) {
              this.oddpnl1 = 0 - stake;
              this.oddpnl2 = 0 - stake;
              this.oddpnl3 = 0 + respnl;
            } else {
              this.oddpnl1 = 0 + stake;
              this.oddpnl2 = 0 + stake;
              this.oddpnl3 = 0 - respnl;
            }
        }
        this.beforeoddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];
      }

    }
    }
  }
}
