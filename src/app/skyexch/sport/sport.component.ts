import { Component, HostListener, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as moment from 'moment';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../../services/authservice.service';
import { SocketServiceService } from '../../services/socket-service.service';
import { DatePipePipe } from "../pipes/datepipe.pipe";
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [CommonModule, DatePipePipe, RouterLink],
  templateUrl: './sport.component.html',
  styleUrls: ['./sport.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SportComponent implements OnInit, OnDestroy {

  isLogin = false;
  warningPopup = false;
  loggedData: any;
  searchpopup = false;
  openNotify = false;
  openSettingpopup = false;
  collapseItm = true;
  validateapi: any;
  data: any
  gameList: any;
  isLoading = false;
  ccount: any;
  tcount: any;
  ssoccer: any;
  mainTabs: any = 1;
  activeTab: any = '4';
  marketList: any;
  byActive = 'compi'
  timeByCompi = false;
  inPlayM = false;
  seriesData: any;
  multiList: any;
  uniqueMatchNames: any;
  leagues = false;
  legueDt = false;
  isToday = true;
  isTomorrow = false;
  tomorrowsData: any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  collpsDtl: any;
  oddsub: any;
  runnersList: any = [];
  socketEventOdds: any;
  filteredMarketIds: any;
  launchUrl: any;

  gameListDataSubject = new BehaviorSubject<any>(null);
  gameListData$: Observable<any> = this.gameListDataSubject.asObservable();
  GamelistData: any;

  gameListDataSubject2 = new BehaviorSubject<any>(null);
  gameListData2$: Observable<any> = this.gameListDataSubject2.asObservable();
  GamelistData2: any;

  sportID: any;
  routersportid: any;
  countmatch: any;
  showSerch = false;
  searchTerm = '';
  filteredObj: any;
  activetab = 'time';
  organizedData: { seriesname: string, matches: any[] }[] = [];
  inplayList: any;
  cricdata: any;
  soccdata: any;
  tenndata: any;
  cricketMatches: any;
  tennisMatches: any;
  soccerMatches: any;
  expandedSectiongame: Set<number> = new Set<number>();
  expandedSectionsOrgdata: Set<number> = new Set<number>();
  gameslist2: any;

  constructor(private authServe: AuthserviceService, private socket: SocketServiceService, private dataServe: DataHandlerService, private activeRoute: ActivatedRoute, private router: Router) { }

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
  isRefreshing = false;
  ngOnInit(): void {
    // let lsData = localStorage.getItem('userData');
    // if (lsData) {
    //   this.loggedData = JSON.parse(lsData);
    //   if (this.loggedData.password !== undefined) {
    //     this.isLogin = true;
    //   } else {
    //     this.isLogin = false
    //   }
    // }

    this.getMarketData();
    this.getData();
    this.getSportsData();

    this.changeCount(1);
  }

  async getData() {
    this.isLoading = true;
    const [multiMarketResponse, inPlayGamesResponse] = await forkJoin([
      this.dataServe.getUserWiseMultiMarket(),
      this.dataServe.getInPlayGames()
    ]).toPromise() as any;
    this.multiList = (multiMarketResponse as any[]).map((rs: any) => (rs.matchid));
    this.gameList = inPlayGamesResponse as any[];
    this.gameList = this.gameList?.map((r: any) => ({
      ...r,
      isMulti: !this.multiList?.includes(r?.eventid)
    }));
    this.GamelistData = this.gameList
    this.gameListDataSubject.next(this.GamelistData);
    this.isLoading = false;

  }

  async getSportsData() {

    const [
      multiMarketResponse,
      todayGamesResponse,
      tomorrowGamesResponse
    ] = await forkJoin([
      this.dataServe.getUserWiseMultiMarket(),
      this.dataServe.getTodayGames(),
      this.dataServe.getTomorrowGames()
    ]).toPromise() as any;

    this.multiList = (multiMarketResponse as any[]).map((rs: any) => rs.matchid);

    // Merge Today + Tomorrow games
    this.gameslist2 = [
      ...(todayGamesResponse as any[]),
      ...(tomorrowGamesResponse as any[])
    ].map((r: any) => ({
      ...r,
      isMulti: !this.multiList?.includes(r.eventid)
    }))
    this.gameListDataSubject2.next(this.gameslist2);

  }

  changeCount(data: any) {
    this.mainTabs = data;

    this.byActive = 'compi';
    this.sportsTab(this.activeTab)
    if (this.mainTabs == 1) {
      this.gameListData$.subscribe((res) => {
        let lists = res;
        if (this.byActive == 'compi') {
          this.isToday = true
        }
        let inplylists = lists;

        this.ccount = inplylists?.filter((re: any) => {
          return re.sportid == '4'
        })
        this.ssoccer = inplylists?.filter((re: any) => {
          return re.sportid == '1'
        })
        this.tcount = inplylists?.filter((re: any) => {
          return re.sportid == '2'
        })
        this.tomorrowsData = []
        this.gameList = lists?.map((r: any) => ({
          ...r,
          isMulti: !this.multiList?.includes(r?.eventid)
        }));
      })
    } else if (this.mainTabs == 2) {
      this.gameListData2$.subscribe((res) => {
        if (this.byActive == 'compi') {
          this.isToday = true
        } else {
          this.tomorrowsData = []
        }
        this.ccount = res.filter((match: any) => match.sportid == 4);
        this.tcount = res.filter((match: any) => match.sportid == 2);
        this.ssoccer = res.filter((match: any) => match.sportid == 1);

        if (this.activeTab == '4') {
          this.gameList = this.gameslist2.filter((re: any) => {
            return re.sportid == '4';
          })
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.filterData(this.gameList)
        }

        if (this.activeTab == '2') {
          this.gameList = this.gameslist2.filter((re: any) => {
            return re.sportid == '2';
          })
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.filterData(this.gameList)
        }
        if (this.activeTab == '1') {
          this.gameList = this.gameslist2.filter((re: any) => {
            return re.sportid == '1';
          })
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.filterData(this.gameList)
        }
        this.gameList = this.gameList?.map((r: any) => ({
          ...r,
          isMulti: !this.multiList?.includes(r?.eventid)
        }));
      })

    }
  }

  filterBySport(sportId: number): any[] {
    return this.gameslist2?.filter((res: any) => res.sportid === sportId);
  }
  organizeDataBySeriesname(): void {
    this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
  }

  getAllInplayList() {
    this.gameListData$.subscribe((res) => {
      this.gameList = res;
      if (this.mainTabs == 1) {
        this.leagues = false;
        if (this.activeTab == '4') {
          this.gameList = this.gameList?.filter((re: any) => {
            return re.sportid == '4';
          })
          this.gameList = this.gameList?.sort((a: any, b: any) => a.openTimestamp - b.openTimestamp);
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);

          this.getOddsData(this.organizedData)
        } else if (this.activeTab == '2') {
          this.gameList = this.gameList.filter((re: any) => {
            return re.sportid == '2';
          })
          this.gameList = this.gameList?.sort((a: any, b: any) => a.openTimestamp - b.openTimestamp);
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.getOddsData(this.organizedData)
        } else if (this.activeTab == '1') {
          this.gameList = this.gameList?.filter((re: any) => {
            return re.sportid == '1';
          })
          this.gameList = this.gameList?.sort((a: any, b: any) => a.openTimestamp - b.openTimestamp);
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.getOddsData(this.organizedData)
        } else {
          if (this.activeTab == 'multi') {
            const matchNames = this.marketList?.map((item: any) => item.matchName?.split(" v "));
            this.uniqueMatchNames = Array.from(new Set(matchNames));
          }
        }

      } else if (this.mainTabs == 2) {
        this.gameListData2$.subscribe((res) => {
          if (this.byActive == 'compi') {
            this.isToday = true
          } else {
            this.tomorrowsData = []
          }
          this.ccount = res.filter((match: any) => match.sportid == 4);
          this.tcount = res.filter((match: any) => match.sportid == 2);
          this.ssoccer = res.filter((match: any) => match.sportid == 1);

          if (this.activeTab == '4') {
            this.gameList = this.gameslist2.filter((re: any) => {
              return re.sportid == '4';
            })
            this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
            this.filterData(this.gameList)
          }

          if (this.activeTab == '2') {
            this.gameList = this.gameslist2.filter((re: any) => {
              return re.sportid == '2';
            })
            this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
            this.filterData(this.gameList)
          }
          if (this.activeTab == '1') {
            this.gameList = this.gameslist2.filter((re: any) => {
              return re.sportid == '1';
            })
            this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
            this.filterData(this.gameList)
          }
        })
      }
      this.gameList = this.gameList?.map((r: any) => ({
          ...r,
          isMulti: !this.multiList?.includes(r?.eventid)
        }));
    })
  }

  getOddsData(data: any) {
    data.forEach((el: any) => {
      this.filteredMarketIds = el.matches
        .filter((re: any, ind: number) => {
          return ind < 2 && re.matchType !== 'virtual' && re.matchType !== 'virtual1' && re.b1 !== undefined;
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
    })
  }

  inPlayMatches(data: any) {
    let date = data;
    let withinHrs = moment(date).format('MM/DD/YYYY HH:mm:ss');
    let date3 = new Date();
    let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');

    if (moment(currentDate).isAfter(withinHrs)) {
      this.inPlayM = true
      return this.inPlayM;
    } else {
      this.inPlayM = false
      return this.inPlayM;
    }
  }

  getRunnerData(marketid: string) {
    return this.runnersList[marketid];
  }

  ngOnDestroy() {
    this.runnersList.forEach((ele: any) => {
      this.socket.destorySocket(ele.events.eventId);
    });

    if (this.oddsub) {
      this.oddsub.unsubscribe();
    }
  }

  showLeagues() {
    this.legueDt = false;
  }

  closeMyBets(data: any) {
    this.searchpopup = data;
    this.openNotify = data;
    this.openSettingpopup = data;
  }

  openSearch() {
    this.searchpopup = true;
  }
  openNotification() {
    this.openNotify = true;
  }
  openSetting() {
    this.openSettingpopup = true;
  }
  todayMtch() {
    this.isToday = true;
    this.isTomorrow = false;
  }
  tomorrowMtch() {
    this.isToday = false;
    this.isTomorrow = true;
  }

  sportsTab(sportId: any) {
    this.activeTab = sportId;
    if (this.mainTabs == 1) {
      this.getAllInplayList()
    } else if (this.mainTabs == 2) {
      this.gameListData2$.subscribe((res) => {
        if (this.byActive == 'compi') {
          this.isToday = true
        } else {
          this.tomorrowsData = []
        }
        this.ccount = res.filter((match: any) => match.sportid == 4);
        this.tcount = res.filter((match: any) => match.sportid == 2);
        this.ssoccer = res.filter((match: any) => match.sportid == 1);

        if (this.activeTab == '4') {
          this.gameList = this.gameslist2.filter((re: any) => {
            return re.sportid == '4';
          })
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.filterData(this.gameList)
        }

        if (this.activeTab == '2') {
          this.gameList = this.gameslist2.filter((re: any) => {
            return re.sportid == '2';
          })
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.filterData(this.gameList)
        }

        if (this.activeTab == '1') {
          this.gameList = this.gameslist2.filter((re: any) => {
            return re.sportid == '1';
          })
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.filterData(this.gameList)
        }
        this.gameList = this.gameList?.map((r: any) => ({
          ...r,
          isMulti: !this.multiList?.includes(r?.eventid)
        }));
      })
    } else if (this.mainTabs == 3) {
      this.gameListData2$.subscribe((res) => {
        if (this.byActive == 'compi') {
          this.isToday = true
        }
        this.ccount = res.filter((match: any) => match.sportid == 4);
        this.tcount = res.filter((match: any) => match.sportid == 2);
        this.ssoccer = res.filter((match: any) => match.sportid == 1);

        if (this.activeTab == '4') {
          this.gameList = this.gameslist2.filter((re: any) => {
            return re.sportid == '4';
          })
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.filterData(this.gameList)
        }

        if (this.activeTab == '2') {
          this.gameList = this.gameslist2.filter((re: any) => {
            return re.sportid == '2';
          })
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.filterData(this.gameList)
        }

        if (this.activeTab == '1') {
          this.gameList = this.gameslist2.filter((re: any) => {
            return re.sportid == '1';
          })
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.filterData(this.gameList)
        }

        this.tomorrowsData = []
      })
    }
    this.expandedSectionsOrgdata = new Set<number>();
    this.collapseItm = true
  }

  goToFrmLogo() {
    if (this.isLogin == true) {
      this.dataServe.LaunchAWCLobby().subscribe((res: any) => {
        if (res.type !== 'error') {
          this.launchUrl = res.launchUrl;
          window.location.href = this.launchUrl;
        }
      });
    } else {
      this.router.navigate(['/login'])
    }
  }


  openTimeCompi() {
    this.timeByCompi = !this.timeByCompi;
  }
  byTimeDefault(dt: any) {
    this.byActive = dt;
    this.timeByCompi = false;
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!(target).closest('.asidebar')) {
      this.timeByCompi = false;
    }
  }

  filterData(data: any[]) {
    let today = moment().startOf('day');
    let tomorrow = moment().add(1, 'day').startOf('day');

    this.gameList = data.filter(item => moment(item.day).isSame(today, 'day'));
    this.tomorrowsData = data.filter(item => moment(item.day).isSame(tomorrow, 'day'));

  }

  getMarketData() {
    this.dataServe.getUserWiseMultiMarket().subscribe((res: any) => {
      this.marketList = res
    }
    );
  }

  async addToMultimarket(id: any): Promise<void> {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    let token = localStorage.getItem('token');
    if (token) {
      let eventId = id.eventid;
      let addMarket: any;
      addMarket = await this.dataServe.addToMultmarketList(eventId).toPromise();
      if (addMarket.type == 'success' && addMarket.message == 'Game Added as Multi Market') {
        this.multiList.push(Array.from(new Set(eventId)));
        id.isMulti = false;
      } else if (addMarket.type == 'success' && addMarket.message == 'Game Removed From Multi Market') {
        this.multiList.push(Array.from(new Set(eventId)));
        id.isMulti = true;
      }
      if(this.mainTabs == 1){
        this.getData();
      }else{
        this.getSportsData();
      }
      this.getMarketData();
    }

    setTimeout(() => {
      this.isRefreshing = false;
    }, 1000);
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
        this.multiList = await this.dataServe.addToMultmarketList(eventId).toPromise();
        if(this.mainTabs == 1){
          this.getData();
        }else{
          this.getSportsData();
        }
        this.getMarketData();
      } finally {
        setTimeout(() => {
          this.isRefreshing = false;
        }, 500);
      }
    } else {
      this.isRefreshing = false;
    }
  }

  filterBySportId(sportId: number): any[] {
    return this.inplayList.filter((res: any) => res.sportid === sportId);
  }

  openMatch(sportid: any, marketid: any, iscupwinner: any) {
    if (iscupwinner) {
      this.router.navigate(['/exchange/cupwinner/' + sportid + '/' + marketid]);
    } else {
      this.router.navigate(['/exchange/match/' + sportid + '/' + marketid]);
    }
  }

  allMethods() {
    this.gameList.forEach((_: any, index: number) => this.expandedSectiongame.add(index));
    this.organizedData.forEach((_, index) => this.expandedSectionsOrgdata.add(index));
  }

  collapseItem() {
    this.collapseItm = !this.collapseItm
    if (this.collapseItm) {
      this.expandedSectionsOrgdata.clear();
    } else {
      this.organizedData.forEach((_, index) => this.expandedSectionsOrgdata.add(index));
    }
  }
  collapseDetails(ind: any) {
    this.collapseItm = true
    if (this.expandedSectionsOrgdata.has(ind)) {
      this.expandedSectionsOrgdata.delete(ind);
    } else {
      this.expandedSectionsOrgdata.add(ind);
    }
    this.updateAllButtonState();
  }
  updateAllButtonState(): void {
    let data = this.expandedSectionsOrgdata.size === this.organizedData.length;
  }

  showSeries: boolean = true
  showleaguematches: any
  showmatches: boolean = false
  onSeriesName(val: any) {
    this.showSeries = false
    this.showleaguematches = val
  }

  onBack() {
    this.showSeries = true
  }

}
