import { Component, HostListener, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../../services/authservice.service';
import { DatahandlerService } from '../../services/datahandler.service';
import { SocketServiceService } from '../../services/socket-service.service';
import { DatePipePipe } from "../pipes/datepipe.pipe";
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-sport',
    imports: [CommonModule, DatePipePipe,RouterLink,LoaderComponent],
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
  gameslist2 : any;

  constructor(private authServe: AuthserviceService, private socket: SocketServiceService, private dataServe: DatahandlerService, private activeRoute: ActivatedRoute, private router: Router) { }

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

  ngOnInit(): void {
    let lsData = localStorage.getItem('userData');
    if (lsData) {
      this.loggedData = JSON.parse(lsData);
      if (this.loggedData.password !== undefined) {
        this.isLogin = true;
      } else {
        this.isLogin = false
      }
    }

    this.getMarketData();
    this.getData();
    this.getSportsData();

    this.changeCount(1);
  }

  getData() {
    this.isLoading = true;
    let sectime = this.dataServe.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    this.dataServe.verifyUser(data).subscribe((res: any) => {
    }, (error) => {
      if (error.status == 200) {
        this.validateapi = this.dataServe.decryptData(error.error.text);
        if (this.validateapi.data.type == 'success') {
          this.dataServe.getInPlayMatches(data).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 200) {
              this.GamelistData = this.dataServe.decryptData(error.error.text);
              this.gameListDataSubject.next(this.GamelistData);
              this.isLoading = false;
            }
          });
        }
      }
    })
  }

  getSportsData() {
    let sectime = this.dataServe.getTimeStamp();
    let data = {"timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }
    this.dataServe.verifyUser(data).subscribe((res: any) => {
    }, (error) => {
      if (error.status == 200) {
        this.validateapi = this.dataServe.decryptData(error.error.text);
        if (this.validateapi.data.type == 'success') {
          this.dataServe.getTodayMatches(data).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 200) {
              let msd = this.dataServe.decryptData(error.error.text);
              let ddt = msd.data.results;

              let sectime1 = this.dataServe.getTimeStamp();
              let data1 = {"timeStamp": sectime1.timeStamp, "secretKey": sectime1.secretKey }
              this.dataServe.verifyUser(data1).subscribe((res: any) => {
              }, (error) => {
                if (error.status == 200) {
                  this.validateapi = this.dataServe.decryptData(error.error.text);
                  if (this.validateapi.data.type == 'success') {
                    this.dataServe.getTomorrowMatches(data1).subscribe((res: any) => {
                    }, (error) => {
                      if (error.status == 200) {
                        let msd1 = this.dataServe.decryptData(error.error.text);
                        let ddt1 = msd1.data.results;
                        let ddt2 = [...ddt, ...ddt1];

                        ddt2.sort((a: any, b: any) => {
                          const dateA = new Date(a.day);
                          const dateB = new Date(b.day);
                          return dateA.getTime() - dateB.getTime();
                        })
                        let newsdt = ddt2.map((r: any) => {
                          r.multi = !this.multiList.includes(r.marketid);
                          return r;
                        });
                        this.gameslist2 = [...newsdt];
                        this.gameListDataSubject2.next(this.gameslist2);
                      }
                    })
                  }
                }
              })

            }
          })
        }
      }
    })

  }

  changeCount(data: any) {
    this.mainTabs = data;

    this.byActive = 'compi';
    this.sportsTab(this.activeTab)
    if (this.mainTabs == 1) {
      this.gameListData$.subscribe((res) => {
        let lists = res?.data?.results;
        if (this.byActive == 'compi') {
          this.isToday = true
        }
        let inplylists = lists
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
        lists?.forEach((item1: any) => {
          const match = this.multiList?.find((item2: any) => item2.matchid === item1.marketid);
          if (match) {
            item1.isMulti = true;
          }
        });
      })
    } else if (this.mainTabs == 2) {
      this.gameListData2$.subscribe((res) => {
        if (this.byActive == 'compi') {
          this.isToday = true
        }else{
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
        this.gameList.forEach((item1: any) => {
          const match = this.multiList?.find((item2: any) => item2.matchid === item1.marketid);
          if (match) {
            item1.isMulti = true;
          }
        });
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
      this.gameList = res?.data?.results
      if (this.mainTabs == 1) {
        this.leagues = false;
        if (this.activeTab == '4') {
          this.gameList = this.gameList?.filter((re: any) => {
            return re.sportid == '4';
          })
          this.gameList = this.gameList?.sort((a:any, b:any) => a.openTimestamp - b.openTimestamp);
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.getOddsData(this.organizedData)
        } else if (this.activeTab == '2') {
          this.gameList = this.gameList.filter((re: any) => {
            return re.sportid == '2';
          })
          this.gameList = this.gameList?.sort((a:any, b:any) => a.openTimestamp - b.openTimestamp);
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.getOddsData(this.organizedData)
        } else if (this.activeTab == '1') {
          this.gameList = this.gameList?.filter((re: any) => {
            return re.sportid == '1';
          })
          this.gameList = this.gameList?.sort((a:any, b:any) => a.openTimestamp - b.openTimestamp);
          this.organizedData = this.dataServe.getOrganizedDataBySeriesname(this.gameList);
          this.getOddsData(this.organizedData)
        } else {
          if (this.activeTab == 'multi') {
            const matchNames = this.multiList?.map((item: any) => item.matchName.split(" v "));
            this.uniqueMatchNames = Array.from(new Set(matchNames));
          }
        }
      } else if(this.mainTabs == 2) {
        this.gameListData2$.subscribe((res) => {
          if (this.byActive == 'compi') {
            this.isToday = true
          }else{
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
      this.gameList?.forEach((item1: any) => {
        const match = this.multiList?.find((item2: any) => item2.matchid === item1.marketid);
        if (match) {
          item1.isMulti = true;
        }
      });
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
        }else{
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
        this.gameList.forEach((item1: any) => {
          const match = this.multiList?.find((item2: any) => item2.matchid === item1.marketid);
          if (match) {
            item1.isMulti = true;
          }
        });
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
    let sectime1 = this.dataServe.getTimeStamp();
    this.isLoading = true;

    let data1 = { "timeStamp": sectime1.timeStamp, "secretKey": sectime1.secretKey }
    this.dataServe.verifyUser(data1).subscribe((res: any) => {
    }, (error) => {
      if (error.status == 200) {

        this.validateapi = this.dataServe.decryptData(error.error.text);
        if (this.validateapi.data.type == 'success') {
          this.dataServe.getActiveMultiMarket(data1).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 202) {
              let msd = this.dataServe.decryptData(error.error.text);
              this.multiList = msd.data.data;
                this.getAllInplayList();
this.isLoading = false;
            }
          })
        }
      }
    })
  }

  addToMultimarket(id: any) {
    this.isLoading = true;
    let idd = id.matchid || id.marketid
    let sectime = this.dataServe.getTimeStamp();
    let data = { "matchId": idd, "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }
    this.dataServe.verifyUser(data).subscribe((res: any) => {
    }, (error) => {
      if (error.status == 200) {
        this.validateapi = this.dataServe.decryptData(error.error.text);
        if (this.validateapi.data.type == 'success') {
          this.dataServe.mutltiMatchUser(data).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 202) {
              let msd = this.dataServe.decryptData1(error.error.text)
              this.getMarketData();
            } else {
              this.getMarketData();
              this.isLoading = false;
            }
          })
        }
      }
    })
  }

  filterBySportId(sportId: number): any[] {
    return this.inplayList.filter((res: any) => res.sportid === sportId);
  }

  openMatch(sportid: any, marketid: any, iscupwinner: any) {
    if(iscupwinner) {
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
