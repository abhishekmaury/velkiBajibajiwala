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
  isLoading = false;
  ccount: any;
  tcount: any;
  ssoccer: any;
  mainTabs: any = 1;
  activeTab: any = '4';
  byActive = 'compi'
  timeByCompi = false;
  inPlayM = false;
  seriesData: any;

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

  multiList: any[] = [];
  marketList: any[] = [];
  gameList: any[] = [];
  gameslist2: any[] = [];

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
  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem('token');

    if (token) {
      this.getMarketData();
    }

    await this.getData();
    await this.getSportsData();

    this.changeCount(1);
  }

  async getData() {
    try {
      this.isLoading = true;

      const inPlayGamesResponse: any =
        await this.dataServe.getInPlayGames().toPromise();

      this.gameList = (inPlayGamesResponse || []).map((r: any) => ({
        ...r,
        isMulti: !this.multiList?.includes(r.eventid)
      }));

      this.GamelistData = this.gameList;

      this.gameListDataSubject.next(this.GamelistData);
    } catch (error) {
      console.error('getData error', error);
    } finally {
      this.isLoading = false;
    }
  }

  async getSportsData() {
    // try {
    //   const [todayGamesResponse, tomorrowGamesResponse] =
    //     await forkJoin([
    //       this.dataServe.getTodayGames(),
    //       this.dataServe.getTomorrowGames()
    //     ]).toPromise() as any;

    //   this.gameslist2 = [
    //     ...(todayGamesResponse || []),
    //     ...(tomorrowGamesResponse || [])
    //   ].map((r: any) => ({
    //     ...r,
    //     isMulti: !this.multiList?.includes(r.eventid)
    //   }));

    //   this.gameListDataSubject2.next(this.gameslist2);
    // } catch (error) {
    //   console.error('getSportsData error', error);
    // }
  }
  changeCount(data: any) {
    this.mainTabs = data;
    this.byActive = 'compi';
    this.sportsTab(this.activeTab);

    if (this.mainTabs == 1) {
      this.gameListData$.subscribe((res: any[]) => {
        const lists = res || [];

        this.isToday = this.byActive === 'compi';

        this.ccount = lists.filter((re: any) => re.sportid == '4');
        this.ssoccer = lists.filter((re: any) => re.sportid == '1');
        this.tcount = lists.filter((re: any) => re.sportid == '2');

        this.tomorrowsData = [];

        this.gameList = lists.map((r: any) => ({
          ...r,
          isMulti: !this.multiList?.includes(r?.eventid)
        }));

        this.organizedData =
          this.dataServe.getOrganizedDataBySeriesname(this.gameList);
      });
      if (this.activeTab == '4') {
        this.gameList = this.gameList.filter(
          (re: any) => re.sportid == '4'
        );
      } else if (this.activeTab == '2') {
        this.gameList = this.gameList.filter(
          (re: any) => re.sportid == '2'
        );
      } else if (this.activeTab == '1') {
        this.gameList = this.gameList.filter(
          (re: any) => re.sportid == '1'
        );
      }
      this.gameList = this.gameList.map((r: any) => ({
        ...r,
        isMulti: !this.multiList?.includes(r?.eventid)
      }));

      this.organizedData =
        this.dataServe.getOrganizedDataBySeriesname(this.gameList);

    }

    else if (this.mainTabs == 2) {
      // this.getSportsData();

      this.gameListData2$.subscribe((res: any[]) => {
        const lists = res || [];

        this.isToday = this.byActive === 'compi';

        if (this.byActive !== 'compi') {
          this.tomorrowsData = [];
        }

        this.ccount = lists.filter((match: any) => match.sportid == '4');
        this.tcount = lists.filter((match: any) => match.sportid == '2');
        this.ssoccer = lists.filter((match: any) => match.sportid == '1');

        switch (this.activeTab) {
          case '4':
            this.gameList = lists.filter(
              (re: any) => re.sportid == '4'
            );
            break;

          case '2':
            this.gameList = lists.filter(
              (re: any) => re.sportid == '2'
            );
            break;

          case '1':
            this.gameList = lists.filter(
              (re: any) => re.sportid == '1'
            );
            break;

          default:
            this.gameList = lists;
        }

        this.gameList = this.gameList.map((r: any) => ({
          ...r,
          isMulti: !this.multiList?.includes(r?.eventid)
        }));

        this.organizedData =
          this.dataServe.getOrganizedDataBySeriesname(this.gameList);

        this.filterData(this.gameList);
      });
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

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.isRefreshing = true;

    try {
      const eventId = id.eventid;

      const response: any = await this.dataServe
        .addToMultmarketList(eventId)
        .toPromise();

      if (response?.type === 'success') {

        // Add
        if (response.message === 'Game Added as Multi Market') {

          if (!this.multiList.includes(eventId)) {
            this.multiList.push(eventId);
          }

          id.isMulti = false;

          // Turant UI me show karna hai
          const exists = this.marketList?.some(
            (x: any) => x.eventid === eventId
          );

          if (!exists) {
            this.marketList = [id, ...(this.marketList || [])];
          }
        }

        // Remove
        else if (
          response.message === 'Game Removed From Multi Market'
        ) {

          this.multiList = this.multiList.filter(
            (x: any) => x !== eventId
          );

          id.isMulti = true;

          this.marketList = (this.marketList || []).filter(
            (x: any) => x.eventid !== eventId
          );
        }

        // Refresh Game List UI
        this.gameList = this.gameList.map((g: any) => ({
          ...g,
          isMulti: !this.multiList.includes(g.eventid)
        }));

        this.gameslist2 = this.gameslist2.map((g: any) => ({
          ...g,
          isMulti: !this.multiList.includes(g.eventid)
        }));

        this.gameListDataSubject.next(this.gameList);
        this.gameListDataSubject2.next(this.gameslist2);

        // Server se fresh Multi Market data
        await this.getMarketData();
      }
    } catch (error) {
      console.error('addToMultimarket error', error);
    } finally {
      this.isRefreshing = false;
    }
  }
  async addToMultimarket1(id: any): Promise<void> {
    if (this.isRefreshing) {
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.isRefreshing = true;

    try {
      const response: any = await this.dataServe
        .addToMultmarketList(id)
        .toPromise();

      this.multiList = this.multiList || [];

      if (
        response?.type === 'success' &&
        response?.message === 'Game Added as Multi Market'
      ) {
        if (!this.multiList.includes(id)) {
          this.multiList.push(id);
        }
      } else if (
        response?.type === 'success' &&
        response?.message === 'Game Removed From Multi Market'
      ) {
        this.multiList = this.multiList.filter(
          (x: any) => x !== id
        );
      }

      // Change detection trigger
      this.multiList = [...this.multiList];

      // Multi market list refresh
      await this.getMarketData();

      // Game list refresh
      if (this.mainTabs == 1) {
        await this.getData();
      } else {
        await this.getSportsData();
      }

    } catch (error) {
      console.error('addToMultimarket1 error', error);
    } finally {
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
